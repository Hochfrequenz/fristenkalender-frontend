// Placeholder so /config.js resolves during `vite dev` and in Cloudflare Pages previews,
// which have no container entrypoint to generate it. In a container this file is shadowed
// by the generated one (nginx serves /config.js from a tmpfs — see docker/nginx.conf).
//
// It deliberately sets nothing: with no runtime values present the app falls back to its
// build-time configuration, which is exactly what preview builds should use.
window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
