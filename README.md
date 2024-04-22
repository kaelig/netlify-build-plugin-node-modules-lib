Netlify Build plugin node-modules-lib - Deploys `node_modules` to production and redirects `node_modules` to `lib`.

Based on [an original idea from Lea Verou](https://twitter.com/LeaVerou/status/1782450349368029433).

# Install

Manual install the plugin:

```sh
npm install netlify-build-plugin-node-modules-lib --save-dev
```

```toml
# netlify.toml
[[plugins]]
  package = "netlify-build-plugin-node-modules-lib"
```

# Configuration

The following `inputs` options are available.
