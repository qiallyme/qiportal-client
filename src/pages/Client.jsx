import { useUser } from '../context/UserContext';

export default function Client() {
  const { email, role } = useUser();

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <h1 className="text-2xl font-semibold mb-2">Client Portal</h1>
      <p className="text-subtext mb-6">Welcome to your dashboard.</p>

      <div className="rounded-xl border p-4 mb-6">
        <div className="text-sm text-subtext mb-1">Signed in as</div>
        <div className="text-lg font-medium">{email || 'Unknown user'}</div>
        <div className="text-sm text-subtext mt-1">Role: {role}</div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn" href="/logout">
            Log out
          </a>
          <a className="btn btn-ghost" href="/">Go to public site</a>
        </div>
      </div>

      <div className="text-sm text-subtext">
        Host: <code>{typeof window !== 'undefined' ? window.location.hostname : ''}</code>
      </div>
    </div>
  );
}
