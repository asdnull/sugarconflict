var config = {
  format: {
    audio: {
      voice: "m4a",
      bgVoice: "m4a",
      se: "m4a",
      bgSe: "m4a",
      bgm: "m4a"
    },
    image: {
      ui: "png",
      bg: "webp",
      ev: "png",
      charIcon: "png",
      thumbnail: "webp",
      animation: "jpg",
      character: "png"
    },
    video: "mp4",
    spine: {
      atlas: "atlas",
      skeleton: "skel",
      skeletonJson: "json",
      image: "webp"
    }
  },
  scene: {
    width: 1280,
    height: 720,
    //Image aspect ratio: x:y
    //Will be automatically calculated based on width and height if not set in the config here
    //arX: 16,
    //arY: 9,
    //If "EV" images should be scaled up and centered on screen, default is: 1
    imageScale: 1.0,
    //Used by ANIM event
    animationFrameTime: 20 //20ms, 50fps
  },
  release: {
    name: "Sugar Conflict X Viewer",
    version: "1.0",
    date: "11-04-2024"
  },
  //A name that will be used as a prefix to all items saved or loaded from the local storage
  //Not necessary in NWJS or Firefox, but in regular chrome it treats all local html files as being from the same place
  //so conflicts with what other html files save in the local storage can occur otherwise
  namePrefix: "sugar_conflict.",
  searchEnabled: false,
  preload: {
    perm: {
      fonts: [
        {
          fontFamily: "rodincattleyapro",
          filename: "FOT-RodinCattleyaPro-B.otf"
        }
      ],
      images: [
        "BG1",
        "BG_TITLE1",
        "arrow_left_icon",
        "arrow_right_icon",
        "chara",
        "checkbox",
        "checkbox_checked",
        "Cmn_poppup_frm_s",
        "Cmn_trust_icon_on",
        "Cmn_trust_icon_on_upscaled",
        "Eve_raid_top_btn_ep",
        "Eve_raid_top_btn_pro",
        "log_button_voice",
        "menu_close_button",
        "menu_option_off_left",
        "menu_option_off_mid",
        "menu_option_off_right",
        "menu_option_on_left",
        "menu_option_on_mid",
        "menu_option_on_right",
        "normalquest_section_radar_eff",
        "off_button_active",
        "off_button_inactive",
        "on_button_active",
        "on_button_inactive",
        "progress_1",
        "progress_2",
        "Quest_capter_frm1",
        "Quest_capter_frm_off",
        "Quest_capter_frm_on",
        "Quest_section_base1",
        "Quest_section_cell_base",
        "Quest_section_cell_difficulty3_afoot",
        "Scene_text_icon_edn1",
        "Scene_text_icon_edn3_eff",
        "Scene_text_icon_edn4_eff",
        "slider_handle",
        "Title_load_gauge_font_1",
        "Title_load_gauge_font_2",
        "text_box3",
        "name_plate_left",
        "name_plate_right",
        "name_plate_repeat"
      ]
    }
  }
};

