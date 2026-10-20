import AdminApp from '@/components/admin/AdminApp'
import Login from '@/components/admin/Login'
import { adminConfigured, isAuthed } from '@/lib/admin/auth'
import { mode, readContent } from '@/lib/admin/store'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className="login pad">
        <h1 className="lmark">atomik</h1>
        <div className="lform">
          <span className="mono grey">Content editor</span>
          <p style={{ margin: 0, fontSize: 18 }}>
            The editor is not switched on yet. In Vercel, open the project’s Settings → Environment Variables and add <b>ADMIN_PASSWORD</b> (at
            least 8 characters) and <b>GITHUB_TOKEN</b>, then redeploy.
          </p>
        </div>
      </main>
    )
  }
  if (!(await isAuthed())) return <Login />
  try {
    const content = await readContent()
    return <AdminApp initial={content} mode={mode()} />
  } catch (e) {
    console.error(e)
    return (
      <main className="login pad">
        <h1 className="lmark">atomik</h1>
        <div className="lform">
          <p className="note err" role="alert">
            The content could not be loaded from GitHub. Check that GITHUB_TOKEN is valid and can read and write the repository, then reload.
          </p>
        </div>
      </main>
    )
  }
}
