import { tasks, task_responses, user_rewards } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const { taskId, response: userResponse } = req.body;

    if (!taskId || !userResponse) {
      return res.status(400).json({ error: 'Task ID and response are required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    // Check if task exists
    const task = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);

    if (task.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Save the task response
    await db.insert(task_responses).values({
      taskId,
      userId: user.id,
      response: userResponse
    });

    // Update user rewards
    const rewardAmount = task[0].reward;

    // Check if user_rewards entry exists
    const userReward = await db.select().from(user_rewards).where(eq(user_rewards.userId, user.id)).limit(1);

    if (userReward.length > 0) {
      // Update existing reward
      await db.update(user_rewards)
        .set({ totalRewards: user_rewards.totalRewards.plus(rewardAmount), updatedAt: new Date() })
        .where(eq(user_rewards.userId, user.id));
    } else {
      // Create new reward entry
      await db.insert(user_rewards).values({
        userId: user.id,
        totalRewards: rewardAmount
      });
    }

    res.status(200).json({ success: true, reward: rewardAmount });
  } catch (error) {
    console.error('Error submitting task:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error submitting task' });
    }
  }
}