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
    // A 기수(generation) filter row lets the club add older classes over
    // time without the page growing into one endless list.
    var graduatesGrid = document.getElementById('graduates-grid');
    var graduatesGenFilter = document.getElementById('graduates-gen-filter');
    if (graduatesGrid && Array.isArray(data.graduates)) {
      var schoolLogos = {};
      (data.graduate_schools || []).forEach(function (s) {
        if (s.name) schoolLogos[s.name] = s.logo;
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

      function graduateSection(g) {
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
      }

      function renderGraduates(list) {
        var groups = [];
        var groupBySchool = {};
        list.forEach(function (gr) {
          var school = gr.destination || '기타';
          if (!groupBySchool[school]) {
            groupBySchool[school] = { school: school, items: [] };
            groups.push(groupBySchool[school]);
          }
          groupBySchool[school].items.push(gr);
        });

        // 가장 인원 많은(먼저 나오는) 학교 둘은 한 줄, 나머지는 그 다음 줄에.
        var firstRow = groups.slice(0, 2);
        var restRow = groups.slice(2);
        var rowStyle = 'display:flex; flex-wrap:wrap; align-items:flex-start; gap:24px';
        graduatesGrid.innerHTML = groups.length
          ? '<div style="' + rowStyle + '">' + firstRow.map(graduateSection).join('') + '</div>' +
            (restRow.length ? '<div style="' + rowStyle + '">' + restRow.map(graduateSection).join('') + '</div>' : '')
          : '<p style="color:var(--color-neutral-600)">아직 등록된 졸업생이 없어요.</p>';
      }

      // 7기~1기 버튼은 실제 데이터가 아직 없는 기수도 항상 보여준다 —
      // 나중에 어드민에서 채워 넣기 전까지는 그냥 "아직 없어요"로 표시됨.
      var GENERATIONS = ['7', '6', '5', '4', '3', '2', '1'];

      if (graduatesGenFilter) {
        function setActive(value) {
          graduatesGenFilter.querySelectorAll('button').forEach(function (btn) {
            var active = btn.getAttribute('data-gen') === value;
            btn.style.background = active ? '#16233f' : '#fff';
            btn.style.color = active ? '#fff' : '#16233f';
          });
          var filtered = data.graduates.filter(function (gr) { return gr.generation === value; });
          renderGraduates(filtered);
        }

        graduatesGenFilter.innerHTML = GENERATIONS.map(function (g) {
          return '<button type="button" data-gen="' + esc(g) + '" style="padding:8px 16px; border-radius:999px; border:1.5px solid #16233f; background:#fff; color:#16233f; font-size:13px; font-weight:700; cursor:pointer">' + esc(g) + '기</button>';
        }).join('');

        graduatesGenFilter.querySelectorAll('button').forEach(function (btn) {
          btn.addEventListener('click', function () { setActive(btn.getAttribute('data-gen')); });
        });

        setActive(GENERATIONS[0]);
      } else {
        renderGraduates(data.graduates);
      }
    }

    // SNS
    var sns = data.sns || {};
    var snsGrid = document.getElementById('sns-grid');
    if (snsGrid) {
      // Real brand marks (Simple Icons, CC0) as inline SVG so they inherit
      // the card's text color via currentColor — plain emoji looked cheap.
      var NAVER_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align:-4px"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/></svg>';
      var INSTAGRAM_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align:-4px"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>';
      var PENCIL_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px"><path d="m18 2 4 4-14 14H4v-4L18 2Z"/></svg>';

      var snsItems = [
        { label: '인스타그램', url: sns.instagram, icon: INSTAGRAM_SVG, color: '#E1306C' },
        { label: '네이버 밴드', url: sns.naver_band, icon: NAVER_SVG, color: '#03C75A' },
        { label: '블로그', url: sns.blog, icon: PENCIL_SVG, color: '#16233f' },
        { label: '네이버 클립', url: sns.naver_clip, icon: NAVER_SVG, color: '#03C75A' }
      ];
      snsGrid.innerHTML = snsItems.map(function (s) {
        var iconSpan = '<span style="margin-right:8px; color:' + s.color + '">' + s.icon + '</span>';
        if (s.url) {
          return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" class="card blueprint" ' +
            'style="padding:22px; text-align:center; text-decoration:none; color:#16233f; font-size:17px; font-weight:700">' +
            iconSpan + esc(s.label) + '</a>';
        }
        return '<div class="card blueprint" style="padding:22px; text-align:center; color:var(--color-neutral-600); font-size:17px; font-weight:700">' +
          iconSpan + esc(s.label) + ' (준비중)</div>';
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
