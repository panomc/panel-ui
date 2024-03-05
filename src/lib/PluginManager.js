import fs from "fs";

import { browser } from "$app/environment";

import ApiUtil from "$lib/api.util.js";
import { API_URL } from "$lib/variables.js";

const plugins = {};

const pluginsFolder = "plugins/";
const manifestFileName = "manifest.json";

function log(message) {
  console.log(`[Plugin Manager] ${message}`);
}

export async function initializePlugins(siteInfo) {
  const pluginsInfo = siteInfo.plugins;

  if (!browser) {
    if (!fs.existsSync(pluginsFolder)) {
      fs.mkdirSync(pluginsFolder, { recursive: true });
    }

    const readPluginsFolder = fs.readdirSync(pluginsFolder);

    Object.keys(plugins)
      .filter((pluginId) => !readPluginsFolder.includes(pluginId))
      .forEach((pluginId) => {
        log(`Couldn't find plugin '${pluginId}', removing...`);

        delete plugins[pluginId];
      });

    readPluginsFolder.forEach((pluginId) => {
      if (pluginsInfo[pluginId] === undefined) {
        log(`Couldn't find plugin '${pluginId}', removing...`);

        fs.rmSync(pluginsFolder + pluginId, { recursive: true, force: true });

        return;
      }

      const manifestFile = fs.readFileSync(
        pluginsFolder + pluginId + "/" + manifestFileName,
        {
          encoding: "utf8",
          flag: "r",
        },
      );

      plugins[pluginId] = JSON.parse(manifestFile);
    });

    Object.keys(pluginsInfo)
      .filter((pluginId) => plugins[pluginId] === undefined)
      .forEach((pluginId) => {
        const pluginFolder = pluginsFolder + pluginId;
        const manifestFilePath = pluginFolder + "/" + manifestFileName;
        const pluginManifest = pluginsInfo[pluginId];

        log(`Installing plugin '${pluginId}'...`);

        if (!fs.existsSync(pluginFolder)) {
          fs.mkdirSync(pluginFolder, { recursive: true });
        }

        fs.writeFileSync(
          manifestFilePath,
          JSON.stringify(pluginManifest, null, 2),
        );
      });

    for (const pluginId of Object.keys(plugins)) {
      const pluginFolder = pluginsFolder + pluginId;

      const pluginInfoManifest = pluginsInfo[pluginId];
      let pluginManifest = plugins[pluginId];

      const files = fs.readdirSync(pluginFolder);

      let noHashMatch = false;

      Object.keys(pluginManifest.uiHashes)
        .filter(
          (fileName) =>
            pluginManifest.uiHashes[fileName] !==
            pluginInfoManifest.uiHashes[fileName],
        )
        .forEach((hash) => {
          noHashMatch = true;
        });

      if (
        pluginManifest.version !== pluginInfoManifest.version ||
        noHashMatch
      ) {
        const manifestFilePath = pluginFolder + "/" + manifestFileName;

        log(`Updating plugin '${pluginId}'.`);

        plugins[pluginId] = pluginInfoManifest;
        pluginManifest = plugins[pluginId];
        fs.writeFileSync(
          manifestFilePath,
          JSON.stringify(pluginManifest, null, 2),
        );

        files
          .filter((fileName) => fileName !== manifestFileName)
          .forEach((fileName) => {
            fs.rmSync(pluginFolder + "/" + fileName, { force: true });
          });
      }

      for (const fileName of Object.keys(pluginManifest.uiHashes)) {
        const fixedFileName = fileName.substring("plugin-ui/".length);
        const filePath = pluginFolder + "/" + fixedFileName;

        if (!fs.existsSync(filePath)) {
          log(`Plugin resource not found: '${filePath}'.`);
          log(`Downloading...`);

          const file = await ApiUtil.get({
            path: `/api/plugins/${pluginId}/resources/${fileName}`,
          });

          fs.writeFileSync(filePath, file);
        }
      }
    }
  } else {
    Object.keys(pluginsInfo).forEach((pluginId) => {
      plugins[pluginId] = pluginsInfo[pluginId];
    });
  }

  await loadPlugins();
}

async function loadPlugins() {
  for (const pluginId of Object.keys(plugins)) {
    const plugin = plugins[pluginId];
    const pluginFolder = pluginsFolder + pluginId;

    if (browser) {
      plugin.module = await import(
        /* @vite-ignore */ `${API_URL}/plugins/${pluginId}/resources/plugin-ui/client.mjs`
      );
    } else {
      const path = `/${pluginFolder}/server.mjs?${Date.now()}`;

      plugin.module = await import(/* @vite-ignore */ path);
    }
  }

  for (const pluginId of Object.keys(plugins)) {
    const plugin = plugins[pluginId];

    await plugin.module.onLoad();
  }
}
