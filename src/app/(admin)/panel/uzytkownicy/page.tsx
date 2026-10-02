import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/catalog";
import { formatPolishText } from "@/lib/typography";

export default async function UsersPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .order("display_name")
    .returns<Profile[]>();
  if (error) throw new Error("Nie udało się pobrać listy użytkowników.");
  return (
    <>
      <div className="panel-heading">
        <div>
          <h1>Użytkownicy</h1>
          <p>Konta i&nbsp;uprawnienia zespołu galerii.</p>
        </div>
      </div>
      <div className="notice">
        W&nbsp;pierwszym etapie konta i&nbsp;role nadajemy w&nbsp;konsoli Supabase. Administrator
        zarządza zespołem; redaktor dodaje i&nbsp;publikuje treści. Konto bez nadanej roli redaktora
        nie ma dostępu do panelu.
      </div>
      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Nazwa użytkownika</th>
              <th>Rola</th>
              <th>ID konta</th>
            </tr>
          </thead>
          <tbody>
            {data.map((profile) => (
              <tr key={profile.id}>
                <td>{formatPolishText(profile.display_name || "Bez nazwy")}</td>
                <td>
                  {profile.role === "admin"
                    ? "Administrator"
                    : profile.role === "editor"
                      ? "Redaktor"
                      : "Bez dostępu"}
                </td>
                <td>{profile.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
