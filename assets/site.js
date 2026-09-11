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

  function photoOrPlaceholder(path, placeholderText, imgStyle) {
    if (path) {
      return '<img src="' + esc(path) + '" alt="" style="width:100%; height:100%; object-fit:cover;' + (imgStyle || '') + '">';
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
        heroBg.innerHTML = '<video src="' + esc(hero.video) + '" autoplay muted loop playsinline ' +
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
        return '<article class="card blueprint" style="padding:0; overflow:hidden">' +
          '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>' +
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

    // Roster
    var rosterGrid = document.getElementById('roster-grid');
    if (rosterGrid && Array.isArray(data.roster)) {
      rosterGrid.innerHTML = data.roster.map(function (p) {
        return '<div style="overflow:hidden; border:1px solid rgba(255,255,255,.18)">' +
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
        return '<div style="aspect-ratio:4/3; border:1px solid var(--color-divider); overflow:hidden">' +
          photoOrPlaceholder(g.photo, '사진') + '</div>';
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
      joinForm.action = 'https://formsubmit.co/' + join.email;
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
