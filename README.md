# Open source NX sub-project as a new repo with Copybara and Github Actions

This repo is an example [Nx](https://nx.dev) monorepo to demonstrate how to use [Copybara Action](https://github.com/olivr/copybara-action/) to open-source a part of the monorepo. Pull-Requests in the destination repo will be synced back to your main repo.

```text
 Source of Truth                  Destination

+---------------+   Copybara   +---------------+
|     Branch    +------------> |     Branch    |
+-------+-------+              +---------------+
        ^
        |
        |
+-------+-------+   Copybara   +---------------+
| Pull Requests | <------------+ Pull Requests |
+---------------+              +---------------+
```

## How it works

1. Apps and libs are tagged properly
2. Running `node tools/externals/prepare.js todos` will update `externals/todos`. (The output of this tool must be kept up to date and committed, you could set-up a pre-commit hook)
3. The Github workflow `.github/workflows/move-code.yml` will then take care of the rest.

## Try it!

1. Fork this repo
2. Create another empty repo to use as the destination
3. [Configure the secrets](https://github.com/olivr/copybara-action/blob/main/docs/basic-usage.md)
4. Run `node tools/externals/prepare.js blog` on your fork, you will see the new folder `externals/blog`
5. Change `.github/workflows/move-code.yml` accordingly (basically search/replace _todos_ by _blog_) and adjust the sot/destination repo values.

## Use in your own repo

The two important bits that you need to copy in your own repo are [prepare.js](/tools/externals/prepare.js) and the Github [workflow](.github/workflows/move-code.yml). Check out [Copybara Action](https://github.com/olivr/copybara-action) for more customization.
