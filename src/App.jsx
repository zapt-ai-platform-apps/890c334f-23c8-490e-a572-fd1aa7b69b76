import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [tasks, setTasks] = createSignal([]);
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [userRewards, setUserRewards] = createSignal(0);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.data.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchTasks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/getTasks', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setTasks(data);
    } else {
      console.error('Error fetching tasks:', response.statusText);
    }
  };

  const fetchUserRewards = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/getUserRewards', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setUserRewards(data.totalRewards);
    } else {
      console.error('Error fetching user rewards:', response.statusText);
    }
  };

  const submitTask = async (taskId, responseText) => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/submitTask', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, response: responseText }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Task completed! You earned ${data.reward} points.`);
        // Refresh user rewards
        await fetchUserRewards();
      } else {
        console.error('Error submitting task');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    if (!user()) return;
    fetchTasks();
    fetchUserRewards();
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">New App</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-2 text-purple-600">Welcome, {user().email}!</h2>
            <p class="text-gray-700">Total Rewards: {userRewards()} points</p>
          </div>
          <div>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">Available Tasks</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <For each={tasks()}>
                {(task) => (
                  <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <h3 class="text-xl font-bold mb-2 text-purple-600">{task.title}</h3>
                    <p class="text-gray-700 mb-4">{task.description}</p>
                    <p class="text-green-600 font-semibold mb-4">Reward: {task.reward} points</p>
                    <button
                      class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        const responseText = prompt('Please provide your response:');
                        if (responseText) {
                          submitTask(task.id, responseText);
                        }
                      }}
                      disabled={loading()}
                    >
                      <Show when={loading()}>Submitting...</Show>
                      <Show when={!loading()}>Complete Task</Show>
                    </button>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;