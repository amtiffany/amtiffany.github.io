(function () {
  const REPO = "amtiffany/amtiffany.github.io";

  const query = `
    query($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        discussion(number: $number) {
          title
          url
          comments(first: 100) {
            totalCount
            nodes {
              author { login avatarUrl url }
              body
              createdAt
              url
            }
          }
        }
      }
    }
  `;

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
      '" alt="" width="32" height="32">' +
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

  async function loadDiscussion(root) {
    const number = parseInt(root.dataset.discussion, 10);
    const list = root.querySelector(".discussion-list");
    const status = root.querySelector(".discussion-status");
    const replyLink = root.querySelector(".discussion-reply");

    const [owner, name] = REPO.split("/");

    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          variables: { owner: owner, name: name, number: number },
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const payload = await response.json();
      if (payload.errors) {
        throw new Error(payload.errors[0].message);
      }

      const discussion = payload.data.repository.discussion;
      const comments = discussion.comments.nodes;

      if (replyLink) {
        replyLink.href = discussion.url;
      }

      if (comments.length === 0) {
        status.textContent = "No messages yet. Be the first to write one.";
        status.hidden = false;
        return;
      }

      status.hidden = true;
      comments.forEach(function (comment) {
        list.appendChild(renderComment(comment));
      });
    } catch (err) {
      status.textContent =
        "Could not load messages. View or post on GitHub instead.";
      status.hidden = false;
      if (replyLink) {
        replyLink.href =
          "https://github.com/" + REPO + "/discussions/" + number;
      }
      console.error("Discussion load failed:", err);
    }
  }

  document.querySelectorAll("[data-discussion]").forEach(loadDiscussion);
})();
