/**
 * Quantumult X - script-response-body
 * Ported from Surge `http-response-jq` rules in `qx.rewrite`.
 */
(() => {
  const url = ($request && $request.url) || "";
  const body = ($response && $response.body) || "";

  const done = (outBody) => $done({ body: outBody });

  let obj;
  try {
    obj = body ? JSON.parse(body) : null;
  } catch {
    done(body);
    return;
  }

  if (!obj || typeof obj !== "object") {
    done(body);
    return;
  }

  const isTncDomains = /^https:\/\/tnc\d-(bjlgy|ali[a-z]{2})\d?\.zijieapi\.com\/get_domains\/v\d\/\?/.test(
    url,
  );
  const isLunaMe = /^https:\/\/(beta-luna\.douyin|api5-lq\.qishui)\.com\/luna\/me\?/.test(
    url,
  );
  const isLunaSongTab = /^https:\/\/(beta-luna\.douyin|api5-lq\.qishui)\.com\/luna\/feed\/song-tab\?/.test(
    url,
  );
  const isLunaCard = /^https:\/\/(beta-luna\.douyin|api5-lq\.qishui)\.com\/luna\/card\?/.test(
    url,
  );
  const isLunaMorePanel = /^https:\/\/(beta-luna\.douyin|api5-lq\.qishui)\.com\/luna\/more-panel\?/.test(
    url,
  );

  try {
    if (isTncDomains) {
      if (obj.data && typeof obj.data === "object") {
        if (Object.prototype.hasOwnProperty.call(obj.data, "opaque_data_enabled")) {
          obj.data.opaque_data_enabled = 0;
        }
        if (Object.prototype.hasOwnProperty.call(obj.data, "ttnet_http_dns_enabled")) {
          obj.data.ttnet_http_dns_enabled = 0;
        }
        if (Object.prototype.hasOwnProperty.call(obj.data, "ttnet_quic_enabled")) {
          obj.data.ttnet_quic_enabled = 0;
        }
        if (Object.prototype.hasOwnProperty.call(obj.data, "ttnet_tt_http_dns")) {
          obj.data.ttnet_tt_http_dns = 0;
        }

        const actions = obj.data.ttnet_dispatch_actions;
        if (Array.isArray(actions)) {
          obj.data.ttnet_dispatch_actions = actions.filter((it) => {
            const action = it && typeof it === "object" ? it.action : undefined;
            return action !== "dispatch" && action !== "tc";
          });
        }
      }
    }

    if (isLunaMe) {
      if (Object.prototype.hasOwnProperty.call(obj, "reward_ad_banner")) {
        delete obj.reward_ad_banner;
      }
    }

    if (isLunaSongTab) {
      if (Array.isArray(obj.items)) {
        obj.items = obj.items.filter((it) => !(it && typeof it === "object" && it.type === "video_track_mix"));
      }
    }

    if (isLunaCard) {
      if (Object.prototype.hasOwnProperty.call(obj, "preview_guide")) {
        delete obj.preview_guide;
      }
      if (Array.isArray(obj.card_items)) {
        obj.card_items = obj.card_items.filter((it) => !(it && typeof it === "object" && Object.prototype.hasOwnProperty.call(it, "priority_display")));
      }
    }

    if (isLunaMorePanel) {
      if (Array.isArray(obj.blocks)) {
        obj.blocks = obj.blocks.filter((it) => !(it && typeof it === "object" && it.type === "related_video"));
      }
    }
  } catch {
    // If anything unexpected happens, fall back to the original body.
    done(body);
    return;
  }

  done(JSON.stringify(obj));
})();
