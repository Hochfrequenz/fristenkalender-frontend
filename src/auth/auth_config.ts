const isDev = import.meta.env.DEV || window.location.hostname === "localhost";

const config = {
  domain: "auth.hochfrequenz.de",
  clientId: isDev ? "" : import.meta.env.VITE_AUTH0_CLIENT_ID || "", // shared "HF-apps-stage/prod" tenant auth0 client IDs
};

export default config as {
  domain: string;
  clientId: string;
};
