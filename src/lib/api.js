export async function api(path) {
    const res = await fetch(path, { credentials: "include" });
    if (res.status === 401) {
      window.location.href = "/logout";
      return;
    }
    return res.json();
  }
  