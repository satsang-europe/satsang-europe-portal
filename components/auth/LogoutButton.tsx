import { signOut } from "@/auth";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white
                   hover:bg-white/10 transition focus:outline-none focus:ring-2
                   focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
      >
        Sign Out
      </button>
    </form>
  );
}
