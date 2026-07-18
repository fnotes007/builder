/**
 * blog-engine.js — Blog mode: post CRUD. Data lives at Builder.project.posts.
 * Published posts are picked up by the "Blog List" section and, on export, get their own
 * static blog-{slug}.html page (see Exporter.buildBlogPostPages).
 */
const BlogEngine = {
  activeId: null,

  init() {
    document.getElementById('post-new-btn').addEventListener('click', () => this.newPost());
  },

  newPost() {
    const title = prompt('Post title:');
    if (!title || !title.trim()) return;
    const post = {
      id: uid('post'), title: title.trim(), slug: Exporter.slugify(title),
      excerpt: '', body: '', featuredImage: '', category: 'General', tags: '', author: '',
      status: 'draft', publishedAt: new Date().toISOString().slice(0, 10),
      seoTitle: '', seoDescription: '',
    };
    Builder.history.snapshotCommand('New Post', () => Builder.project.posts, (s) => { Builder.project.posts = s; },
      () => { Builder.project.posts.push(post); });
    this.activeId = post.id;
    this.render();
  },

  render() {
    const posts = Builder.project.posts;
    const listEl = document.getElementById('post-list-items');
    listEl.innerHTML = posts.map(p => `
      <div class="wb-col-item ${p.id === this.activeId ? 'active' : ''}" data-id="${p.id}">
        <div>${escapeHtml(p.title)} <span class="wb-post-status-chip ${p.status}">${p.status}</span></div>
        <div class="cnt">${escapeHtml(p.category || 'General')}</div>
      </div>`).join('');
    listEl.querySelectorAll('.wb-col-item').forEach(el => {
      el.addEventListener('click', () => { this.activeId = el.dataset.id; this.render(); });
    });

    const mainEl = document.getElementById('blog-main');
    if (!posts.length) {
      mainEl.innerHTML = `<div class="wb-mode-empty">
        <p><b>No posts yet.</b></p>
        <p style="margin-top:8px;">Click <b>+ New Post</b> to write one. Posts stay in Draft until you publish them — only published posts show up in a Blog List section or export as real pages.</p>
      </div>`;
      return;
    }
    if (!this.activeId || !posts.find(p => p.id === this.activeId)) this.activeId = posts[0].id;
    this.renderEditor();
  },

  renderEditor() {
    const post = Builder.project.posts.find(p => p.id === this.activeId);
    if (!post) return;
    const mainEl = document.getElementById('blog-main');
    mainEl.innerHTML = `
      <h2>${escapeHtml(post.title)} <span class="wb-post-status-chip ${post.status}">${post.status}</span></h2>
      <div class="wb-mode-sub">Slug: ${escapeHtml(post.slug)} · exports as blog-${escapeHtml(post.slug)}.html when published</div>

      <div class="wb-mode-section">
        <h4>Content</h4>
        <div class="wb-field"><label>Title</label><input type="text" id="pf-title" value="${escapeHtml(post.title)}"></div>
        <div class="wb-field"><label>Excerpt (shown in Blog List cards)</label><input type="text" id="pf-excerpt" value="${escapeHtml(post.excerpt)}"></div>
        <div class="wb-field"><label>Body</label><textarea id="pf-body" rows="10">${escapeHtml(post.body)}</textarea></div>
        <div class="wb-field">
          <label>Featured image</label>
          <input type="text" id="pf-image" value="${escapeHtml(post.featuredImage)}" placeholder="https://... or pick from Media">
          <button type="button" class="wb-btn-line" id="pf-pick-media" style="margin-top:6px;">Pick from Media Library</button>
        </div>
      </div>

      <div class="wb-mode-section">
        <h4>Organization</h4>
        <div class="wb-field"><label>Category</label><input type="text" id="pf-category" value="${escapeHtml(post.category)}"></div>
        <div class="wb-field"><label>Tags (comma-separated)</label><input type="text" id="pf-tags" value="${escapeHtml(post.tags)}"></div>
        <div class="wb-field"><label>Author</label><input type="text" id="pf-author" value="${escapeHtml(post.author)}"></div>
      </div>

      <div class="wb-mode-section">
        <h4>Publishing</h4>
        <div class="wb-field">
          <label>Status</label>
          <select id="pf-status">
            <option value="draft" ${post.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="published" ${post.status === 'published' ? 'selected' : ''}>Published</option>
          </select>
        </div>
        <div class="wb-field"><label>Published date</label><input type="date" id="pf-date" value="${escapeHtml(post.publishedAt)}"></div>
      </div>

      <div class="wb-mode-section">
        <h4>SEO</h4>
        <div class="wb-field"><label>SEO title (falls back to post title)</label><input type="text" id="pf-seo-title" value="${escapeHtml(post.seoTitle)}"></div>
        <div class="wb-field"><label>Meta description</label><input type="text" id="pf-seo-desc" value="${escapeHtml(post.seoDescription)}"></div>
      </div>

      <div style="display:flex;gap:8px;">
        <button class="wb-btn-primary-lg" id="pf-save">Save</button>
        <button class="wb-btn-line" id="pf-delete" style="width:auto;color:var(--danger);">Delete post</button>
      </div>`;

    document.getElementById('pf-pick-media').addEventListener('click', () => {
      MediaLibrary.openPicker((url) => { document.getElementById('pf-image').value = url; });
    });

    document.getElementById('pf-save').addEventListener('click', () => {
      const updated = {
        title: document.getElementById('pf-title').value || post.title,
        excerpt: document.getElementById('pf-excerpt').value,
        body: document.getElementById('pf-body').value,
        featuredImage: document.getElementById('pf-image').value,
        category: document.getElementById('pf-category').value,
        tags: document.getElementById('pf-tags').value,
        author: document.getElementById('pf-author').value,
        status: document.getElementById('pf-status').value,
        publishedAt: document.getElementById('pf-date').value,
        seoTitle: document.getElementById('pf-seo-title').value,
        seoDescription: document.getElementById('pf-seo-desc').value,
      };
      Builder.history.snapshotCommand('Save Post', () => Builder.project.posts, (s) => { Builder.project.posts = s; },
        () => {
          Object.assign(post, updated);
          post.slug = Exporter.slugify(post.title) || post.slug;
        });
      this.render();
      UI.toast('Saved.', 'success');
    });
    document.getElementById('pf-delete').addEventListener('click', () => {
      if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
      Builder.history.snapshotCommand('Delete Post', () => Builder.project.posts, (s) => { Builder.project.posts = s; },
        () => { Builder.project.posts = Builder.project.posts.filter(p => p.id !== post.id); });
      this.activeId = null;
      this.render();
    });
  },
};
window.BlogEngine = BlogEngine;
