import { postJSON } from '../api/client'

export default function LogoutButton({ onDone }) {
  const logout = async () => {
    try {
      await postJSON('/auth/logout', {})
      onDone?.()
    } catch (e) {
      // ignore UI errors here
      onDone?.()
    }
  }
  return (
    <button onClick={logout} className="rounded bg-slate-800 text-white px-3 py-2">
      Log out
    </button>
  )
}
