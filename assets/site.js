(function () {
  var RESULT_STYLE = {
    upcoming: 'class="tag tag-outline"',
    win: 'style="background:#d1491f; color:#fff; border:0" class="tag"',
    lose: 'class="tag tag-neutral"'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // New uploads come back as "/hwaseong-little-club/assets/uploads/x.jpg"
  // (correct everywhere, incl. the admin's own preview one folder deeper
  // at /admin/) — leave those alone. Older entries were saved as
  // root-absolute without the repo prefix (e.g. "/assets/uploads/x.jpg"),
  // which 404s under this GitHub Pages subpath; stripping the leading
  // slash there makes them resolve relative to this page instead.
  function assetUrl(path) {
    if (!path) return path;
    if (path.indexOf('/hwaseong-little-club/') === 0) return path;
    return path.replace(/^\/+/, '');
  }

  function photoOrPlaceholder(path, placeholderText, imgStyle) {
    if (path) {
      return '<img src="' + esc(assetUrl(path)) + '" alt="" style="width:100%; height:100%; object-fit:cover;' + (imgStyle || '') + '">';
    }
    return '<div class="ph" style="height:100%">' + esc(placeholderText) + '</div>';
  }

  function render(data) {
    // Hero
    var hero = data.hero || {};
    setText('hero-kicker1', hero.kicker1);
    setText('hero-kicker2', hero.kicker2);
    setText('hero-title-1', hero.title_line1);
    setText('hero-title-2', hero.title_line2);
    setText('hero-subtitle', hero.subtitle);
    var heroBg = document.getElementById('hero-bg');
    if (heroBg) {
      if (hero.video) {
        heroBg.innerHTML = '<video src="' + esc(assetUrl(hero.video)) + '" autoplay muted loop playsinline ' +
          'style="width:100%; height:100%; object-fit:cover"></video>';
      } else {
        heroBg.innerHTML = photoOrPlaceholder(hero.image, '히어로 사진을 넣어주세요 (경기/훈련 사진)');
      }
    }
    var statsWrap = document.getElementById('hero-stats');
    if (statsWrap && Array.isArray(hero.stats)) {
      statsWrap.innerHTML = hero.stats.map(function (s) {
        return '<div style="padding:22px 0">' +
          '<div style="font-family:\'Barlow Condensed\',sans-serif; font-size:34px; line-height:1">' + esc(s.value) + '</div>' +
          '<div style="font-size:12px; letter-spacing:.14em; color:#9fb3cf">' + esc(s.label) + '</div></div>';
      }).join('');
    }

    // News
    var newsGrid = document.getElementById('news-grid');
    if (newsGrid && Array.isArray(data.news)) {
      newsGrid.innerHTML = data.news.map(function (n) {
        return '<article style="padding:0; overflow:hidden; border-radius:16px; border:1px solid var(--color-divider); background:#fff">' +
          '<div style="height:170px; overflow:hidden">' + photoOrPlaceholder(n.image, '소식 이미지') + '</div>' +
          '<div style="padding:18px">' +
          '<div class="card-kicker" style="color:#d1491f">' + esc(n.date_label) + '</div>' +
          '<h3 class="card-title" style="font-size:22px">' + esc(n.title) + '</h3>' +
          '<p class="card-body" style="margin:0">' + esc(n.body) + '</p>' +
          '</div></article>';
      }).join('');
    }

    // Schedule
    var scheduleBody = document.getElementById('schedule-body');
    if (scheduleBody && Array.isArray(data.schedule)) {
      scheduleBody.innerHTML = data.schedule.map(function (g) {
        var tagAttrs = RESULT_STYLE[g.result_type] || RESULT_STYLE.upcoming;
        return '<tr><td>' + esc(g.date) + '</td><td>' + esc(g.competition) + '</td><td>' + esc(g.opponent) +
          '</td><td>' + esc(g.venue) + '</td><td><span ' + tagAttrs + '>' + esc(g.result_text) + '</span></td></tr>';
      }).join('');
    }

    // About
    var about = data.about || {};
    setText('about-text', about.text);
    var aboutPhoto = document.getElementById('about-photo');
    if (aboutPhoto) aboutPhoto.innerHTML = photoOrPlaceholder(about.photo, '팀 단체사진');
    var aboutTiles = document.getElementById('about-tiles');
    if (aboutTiles) {
      var tileHeight = about.tile_height || 500;
      var tiles = [
        { photo: about.photo, hover: about.photo_hover, position: about.photo_position, title: '구단소개', href: 'about.html' },
        { photo: about.photo2, hover: about.photo2_hover, position: about.photo2_position, title: '선수반안내', href: 'players.html' },
        { photo: about.photo3, hover: about.photo3_hover, position: about.photo3_position, title: '육성반안내', href: 'development.html' }
      ];
      aboutTiles.innerHTML = tiles.map(function (t) {
        var pos = t.position || 'center';
        var imgStyle = ' object-position:' + esc(pos) + ';';
        return '<a href="' + t.href + '" class="about-tile" style="position:relative; display:block; overflow:hidden; border-radius:20px; text-decoration:none; --tile-h:' + tileHeight + 'px">' +
          '<div class="about-tile-img about-tile-img-base">' + photoOrPlaceholder(t.photo, t.title + ' 사진', imgStyle) + '</div>' +
          (t.hover ? '<div class="about-tile-img about-tile-img-hover">' + photoOrPlaceholder(t.hover, t.title + ' 사진 2', imgStyle) + '</div>' : '') +
          '<div style="position:absolute; left:14px; bottom:14px; display:flex; align-items:center; gap:14px; background:#16233f; padding:14px 18px; max-width:calc(100% - 28px); border-radius:14px">' +
          '<div>' +
          '<div style="font-size:11px; color:#9fb3cf; letter-spacing:.06em; margin-bottom:2px">화성시 서부리틀야구단</div>' +
          '<div style="font-size:20px; font-weight:800; color:#fff">' + esc(t.title) + '</div>' +
          '</div>' +
          '<span style="flex:none; width:34px; height:34px; border:2px solid #fff; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:16px">→</span>' +
          '</div></a>';
      }).join('');
    }

    // Roster
    var rosterGrid = document.getElementById('roster-grid');
    if (rosterGrid && Array.isArray(data.roster)) {
      rosterGrid.innerHTML = data.roster.map(function (p) {
        return '<div style="overflow:hidden; border-radius:14px; border:1px solid rgba(255,255,255,.18)">' +
          '<div style="aspect-ratio:3/4; position:relative">' + photoOrPlaceholder(p.photo, '프로필 사진') + '</div>' +
          '<div style="background:#0f1932; padding:8px 10px">' +
          '<div style="display:flex; align-items:baseline; justify-content:space-between; gap:6px">' +
          '<span style="font-size:14px; font-weight:700; color:#fff">' + esc(p.name) + '</span>' +
          '<span style="font-family:\'Barlow Condensed\',sans-serif; font-size:14px; font-weight:700; color:#d1491f; white-space:nowrap">NO.' + esc(p.number) + '</span>' +
          '</div>' +
          '<div style="font-size:10px; letter-spacing:.08em; color:#9fb3cf; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">' + esc(p.position) + '</div>' +
          '</div></div>';
      }).join('');
    }

    // Gallery
    var galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid && Array.isArray(data.gallery)) {
      galleryGrid.innerHTML = data.gallery.map(function (g) {
        return '<div style="aspect-ratio:4/3; border:1px solid var(--color-divider); overflow:hidden; border-radius:14px">' +
          photoOrPlaceholder(g.photo, '사진') + '</div>';
      }).join('');
    }

    // Graduates (graduates.html) — grouped by destination school, each
    // group headed by that school's logo (from graduate_schools) if set.
    var graduatesGrid = document.getElementById('graduates-grid');
    if (graduatesGrid && Array.isArray(data.graduates)) {
      var schoolLogos = {};
      (data.graduate_schools || []).forEach(function (s) {
        if (s.name) schoolLogos[s.name] = s.logo;
      });

      var groups = [];
      var groupBySchool = {};
      data.graduates.forEach(function (gr) {
        var school = gr.destination || '기타';
        if (!groupBySchool[school]) {
          groupBySchool[school] = { school: school, items: [] };
          groups.push(groupBySchool[school]);
        }
        groupBySchool[school].items.push(gr);
      });

      function graduateCard(gr) {
        return '<div class="grad-card" style="flex:0 0 150px; overflow:hidden; border-radius:14px; border:1px solid var(--color-divider); background:#fff">' +
          '<div style="aspect-ratio:3/4; position:relative">' + photoOrPlaceholder(gr.photo, '졸업생 사진') + '</div>' +
          '<div style="padding:8px 10px">' +
          '<div style="display:flex; align-items:baseline; justify-content:space-between; gap:6px">' +
          '<span style="font-size:14px; font-weight:700; color:#16233f">' + esc(gr.name) + '</span>' +
          '<span style="font-family:\'Barlow Condensed\',sans-serif; font-size:12px; font-weight:700; color:#d1491f; white-space:nowrap">' + esc(gr.grad_year) + '년 졸업</span>' +
          '</div>' +
          (gr.note ? '<p style="font-size:11px; color:var(--color-neutral-600); margin:4px 0 0; line-height:1.5">' + esc(gr.note) + '</p>' : '') +
          '</div></div>';
      }

      graduatesGrid.innerHTML = groups.map(function (g) {
        var logo = schoolLogos[g.school];
        return '<div class="grad-section">' +
          '<div style="display:flex; align-items:center; gap:14px; margin-bottom:18px">' +
          '<span class="grad-logo-badge">' + (logo ? '<img src="' + esc(assetUrl(logo)) + '" alt="" style="width:36px; height:36px; object-fit:contain">' : '⚾') + '</span>' +
          '<div>' +
          '<div style="font-size:19px; font-weight:800; color:#16233f">' + esc(g.school) + '</div>' +
          '<div style="font-size:12px; color:var(--color-neutral-600); letter-spacing:.04em">진학 · ' + g.items.length + '명</div>' +
          '</div>' +
          '</div>' +
          '<div style="display:flex; flex-wrap:wrap; gap:14px">' +
          g.items.map(graduateCard).join('') +
          '</div></div>';
      }).join('');
    }

    // SNS
    var sns = data.sns || {};
    var snsGrid = document.getElementById('sns-grid');
    if (snsGrid) {
      var snsItems = [
        { label: '네이버 클립', url: sns.naver_clip },
        { label: '네이버 밴드', url: sns.naver_band },
        { label: '인스타그램', url: sns.instagram },
        { label: '블로그', url: sns.blog }
      ];
      snsGrid.innerHTML = snsItems.map(function (s) {
        if (s.url) {
          return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" class="card blueprint" ' +
            'style="padding:22px; text-align:center; text-decoration:none; color:#16233f; font-size:17px; font-weight:700">' +
            esc(s.label) + '</a>';
        }
        return '<div class="card blueprint" style="padding:22px; text-align:center; color:var(--color-neutral-600); font-size:17px; font-weight:700">' +
          esc(s.label) + ' (준비중)</div>';
      }).join('');
    }

    // Join / contact
    var join = data.join || {};
    var joinInfo = document.getElementById('join-info');
    if (joinInfo) {
      joinInfo.innerHTML =
        '<div>훈련장 · ' + esc(join.training_location) + '</div>' +
        '<div>훈련일 · ' + esc(join.training_time) + '</div>' +
        '<div>문의 · ' + esc(join.phone) + ' / ' + esc(join.email) + '</div>';
    }
    var joinForm = document.getElementById('join-form');
    if (joinForm && join.email) {
      joinForm.setAttribute('data-notify-email', join.email);
    }
    if (joinForm && join.team_join_code) {
      joinForm.setAttribute('data-team-join-code', join.team_join_code);
    }
    if (joinForm && join.player_signup_code) {
      joinForm.setAttribute('data-player-signup-code', join.player_signup_code);
    }
    if (joinForm && join.parent_signup_code) {
      joinForm.setAttribute('data-parent-signup-code', join.parent_signup_code);
    }
    var applyForm = document.getElementById('apply-form');
    if (applyForm && join.email) {
      applyForm.setAttribute('data-notify-email', join.email);
    }
    var footerContact = document.getElementById('footer-contact');
    if (footerContact) {
      footerContact.textContent = '경기도 화성시 · ' + (join.phone || '') + ' · ' + (join.email || '');
    }
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  fetch('content/site.json', { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .then(render)
    .catch(function (err) { console.warn('site content load failed:', err); });
})();
