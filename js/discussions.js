(function () {
  const REPO = "amtiffany/amtiffany.github.io";

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function renderMarkdownLite(text) {
    let html = escapeHtml(text);
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" rel="noopener noreferrer">$1</a>'
    );
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/\n\n/g, "</p><p>");
    html = html.replace(/\n/g, "<br>");
    return "<p>" + html + "</p>";
  }

  function renderComment(comment) {
    const li = document.createElement("li");
    li.className = "discussion-comment";
    li.innerHTML =
      '<header class="comment-header">' +
      '<img class="comment-avatar" src="' +
      escapeHtml(comment.author.avatarUrl) +
      '" alt="" width="32" height="32" loading="lazy">' +
      '<div class="comment-meta">' +
      '<a class="comment-author" href="' +
      escapeHtml(comment.author.url) +
      '">' +
      escapeHtml(comment.author.login) +
      "</a>" +
      '<time class="comment-date" datetime="' +
      escapeHtml(comment.createdAt) +
      '">' +
      formatDate(comment.createdAt) +
      "</time>" +
      "</div>" +
      "</header>" +
      '<div class="comment-body">' +
      renderMarkdownLite(comment.body) +
      "</div>";
    return li;
  }

  function normalizeComment(raw) {
    return {
      author: {
        login: raw.user.login,
        avatarUrl: raw.user.avatar_url,
        url: raw.user.html_url,
      },
      body: raw.body,
      createdAt: raw.created_at,
    };
  }

  async function fetchComments(owner, name, number) {
    const comments = [];
    let page = 1;

    while (page <= 10) {
      const url =
        "https://api.github.com/repos/" +
        owner +
        "/" +
        name +
        "/discussions/" +
        number +
        "/comments?per_page=100&page=" +
        page;

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const batch = await response.json();
      if (!Array.isArray(batch) || batch.length === 0) {
        break;
      }

      comments.push.apply(comments, batch);

      if (batch.length < 100) {
        break;
      }
      page += 1;
    }

    return comments;
  }

  async function loadDiscussion(root) {
    const number = parseInt(root.dataset.discussion, 10);
    const list = root.querySelector(".discussion-list");
    const replyLink = root.querySelector(".discussion-reply");
    const [owner, name] = REPO.split("/");
    const discussionUrl =
      "https://github.com/" + REPO + "/discussions/" + number;

    if (replyLink) {
      replyLink.href = discussionUrl;
    }

    try {
      const rawComments = await fetchComments(owner, name, number);

      rawComments.forEach(function (raw) {
        list.appendChild(renderComment(normalizeComment(raw)));
      });
    } catch (err) {
      console.error("Discussion load failed:", err);
    }
  }

  document.querySelectorAll("[data-discussion]").forEach(loadDiscussion);
})();
