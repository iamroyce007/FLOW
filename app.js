/* ═══════════════════════════════════════════════════
   FLOW — Full Interactive Application
   Working prototype with functional buttons & actions
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════ TOAST NOTIFICATION SYSTEM ══════════════
  function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌', ai: '🤖' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '✦'}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ══════════════ GREETING ══════════════
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';
  document.getElementById('greetingText').textContent = `${greeting}, ${FLOW_DATA.user.name}`;
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('greetingSub').textContent =
    `${today.toLocaleDateString('en-US', options)} — 3 conflicts resolved overnight`;

  // ══════════════ NAVIGATION ══════════════
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');

  function navigateTo(page) {
    FLOW_STATE.currentPage = page;
    navItems.forEach(n => n.classList.remove('active'));
    const navEl = document.querySelector(`[data-page="${page}"]`);
    if (navEl) navEl.classList.add('active');
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) {
      target.classList.add('active');
      target.style.animation = 'none';
      target.offsetHeight;
      target.style.animation = '';
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  document.getElementById('viewAllCommitments').addEventListener('click', () => navigateTo('commitments'));
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // ══════════════ RENDER TIMELINE ══════════════
  const timelineEl = document.getElementById('timeline');

  function renderTimeline() {
    timelineEl.innerHTML = '';
    FLOW_DATA.timeline.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = `timeline-item ${item.current ? 'current' : ''}`;
      div.style.animationDelay = `${0.1 + i * 0.04}s`;
      div.innerHTML = `
        <span class="timeline-time">${item.time}</span>
        <span class="timeline-dot ${item.type} ${item.current ? 'current' : ''}"></span>
        <div class="timeline-info">
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-subtitle">${item.subtitle}</div>
        </div>
        <span class="timeline-tag tag-${item.type}">${item.tag}</span>
      `;
      if (item.editable) {
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => {
          showToast(`📅 "${item.title}" at ${item.time} — ${item.subtitle}`, 'info');
        });
      }
      timelineEl.appendChild(div);
    });
  }
  renderTimeline();

  // ══════════════ RENDER COMMITMENTS (Dashboard) ══════════════
  function renderDashboardCommitments() {
    const el = document.getElementById('commitmentList');
    el.innerHTML = '';
    const active = FLOW_DATA.commitments.filter(c => c.status !== 'done').slice(0, 5);
    if (active.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">🎉 All caught up! No pending commitments.</div>';
      return;
    }
    active.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'commitment-item';
      div.style.animationDelay = `${0.1 + i * 0.04}s`;
      const statusIcon = { pending: '⏳', overdue: '⚠️', done: '✅', waiting: '⏳' }[item.status];
      div.innerHTML = `
        <div class="commitment-top">
          <span class="commitment-status status-${item.status}">${statusIcon} ${item.status}</span>
          <span class="commitment-who">${item.who}</span>
        </div>
        <div class="commitment-what">${item.what}</div>
        <div class="commitment-meta">
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>${item.deadline}</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>${item.source}</span>
        </div>
        <div class="commitment-quick-actions">
          <button class="btn-xs btn-done" data-id="${item.id}" title="Mark done">✓ Done</button>
          ${item.status === 'overdue' ? `<button class="btn-xs btn-urgent" data-id="${item.id}">⚡ Action Now</button>` : ''}
        </div>
      `;
      el.appendChild(div);
    });
    // Bind quick action buttons
    el.querySelectorAll('.btn-done').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        markCommitmentDone(btn.dataset.id);
      });
    });
    el.querySelectorAll('.btn-urgent').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const c = FLOW_DATA.commitments.find(x => x.id === btn.dataset.id);
        showToast(`⚡ Prioritizing "${c.what}" — blocking next available time slot`, 'ai');
      });
    });
  }

  function markCommitmentDone(id) {
    const c = FLOW_DATA.commitments.find(x => x.id === id);
    if (!c || c.status === 'done') return;
    c.status = 'done';
    FLOW_STATE.stats.activeCommitments--;
    showToast(`✅ Completed: "${c.what}"`, 'success');
    renderDashboardCommitments();
    renderCommitmentsFull(FLOW_STATE.commitmentFilter);
    updateStats();
    // Log AI decision
    addAiDecision('resolve', 'Completed', `User marked <strong>"${c.what}"</strong> as done. Updated commitment tracker and recalculated stats.`);
  }

  function updateStats() {
    const active = FLOW_DATA.commitments.filter(c => c.status !== 'done');
    document.getElementById('statCommitments').textContent = active.length;
    const unread = FLOW_DATA.emails.filter(e => e.unread && !e.archived);
    document.getElementById('statEmails').textContent = FLOW_DATA.emails.filter(e => !e.archived).length;
    // Update nav badge
    const badge = document.querySelector('#nav-emails .nav-badge');
    if (badge) badge.textContent = unread.length;
  }

  renderDashboardCommitments();

  // ══════════════ COMMITMENTS FULL PAGE ══════════════
  const commitmentsFullEl = document.getElementById('commitmentsFullList');

  function renderCommitmentsFull(filter) {
    FLOW_STATE.commitmentFilter = filter;
    commitmentsFullEl.innerHTML = '';
    let items = FLOW_DATA.commitments;
    if (filter !== 'all') items = items.filter(c => c.status === filter);

    if (items.length === 0) {
      commitmentsFullEl.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);grid-column:1/-1"><div style="font-size:2rem;margin-bottom:8px">🎯</div>No commitments in this category</div>';
      return;
    }

    items.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'commitment-card-full';
      div.style.animation = `slideUp 0.4s ease ${i * 0.06}s both`;
      const statusIcon = { pending: '⏳', overdue: '⚠️', done: '✅', waiting: '⏳' }[item.status];
      const priorityColors = { critical: '#f43f5e', high: '#f59e0b', medium: '#6366f1', low: '#64748b' };

      div.innerHTML = `
        <div class="commitment-card-header">
          <span class="commitment-status status-${item.status}">${statusIcon} ${item.status}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="priority-dot" style="background:${priorityColors[item.priority]}" title="${item.priority} priority"></span>
            <span style="font-size:0.75rem;color:var(--text-muted)">${item.direction === 'outgoing' ? '↗ You owe' : '↙ They owe'}</span>
          </div>
        </div>
        <div class="commitment-card-title">${item.what}</div>
        <div class="commitment-card-body">
          <div class="commitment-card-field"><span class="field-label">Who</span><span>${item.who}</span></div>
          <div class="commitment-card-field"><span class="field-label">By When</span><span>${item.deadline}</span></div>
          <div class="commitment-card-field"><span class="field-label">Source</span><span>${item.source}</span></div>
          <div class="commitment-card-field"><span class="field-label">Time</span><span>${item.timeBlocked}</span></div>
        </div>
        <div class="commitment-card-actions">
          ${item.status !== 'done' ? `<button class="btn-sm btn-primary btn-mark-done" data-id="${item.id}">${item.status === 'overdue' ? '⚡ Action Now' : '✓ Mark Done'}</button>` : '<button class="btn-sm btn-success-filled" disabled>✅ Completed</button>'}
          ${item.status !== 'done' ? `<button class="btn-sm btn-outline btn-snooze" data-id="${item.id}">⏰ Snooze</button>` : ''}
          <button class="btn-sm btn-outline btn-delete-commit" data-id="${item.id}">🗑️</button>
        </div>
      `;
      commitmentsFullEl.appendChild(div);
    });

    // Bind buttons
    commitmentsFullEl.querySelectorAll('.btn-mark-done').forEach(btn => {
      btn.addEventListener('click', () => markCommitmentDone(btn.dataset.id));
    });
    commitmentsFullEl.querySelectorAll('.btn-snooze').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = FLOW_DATA.commitments.find(x => x.id === btn.dataset.id);
        showToast(`⏰ Snoozed "${c.what}" — rescheduled to tomorrow`, 'info');
        c.deadline = 'Tomorrow';
        renderCommitmentsFull(FLOW_STATE.commitmentFilter);
        renderDashboardCommitments();
      });
    });
    commitmentsFullEl.querySelectorAll('.btn-delete-commit').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = FLOW_DATA.commitments.findIndex(x => x.id === btn.dataset.id);
        if (idx > -1) {
          const name = FLOW_DATA.commitments[idx].what;
          FLOW_DATA.commitments.splice(idx, 1);
          showToast(`🗑️ Removed: "${name}"`, 'warning');
          renderCommitmentsFull(FLOW_STATE.commitmentFilter);
          renderDashboardCommitments();
          updateStats();
          updateFilterCounts();
        }
      });
    });
  }

  function updateFilterCounts() {
    const all = FLOW_DATA.commitments.length;
    const pending = FLOW_DATA.commitments.filter(c => c.status === 'pending').length;
    const overdue = FLOW_DATA.commitments.filter(c => c.status === 'overdue').length;
    const waiting = FLOW_DATA.commitments.filter(c => c.status === 'waiting').length;
    const done = FLOW_DATA.commitments.filter(c => c.status === 'done').length;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const f = btn.dataset.filter;
      const counts = { all, pending, overdue, waiting, done };
      if (counts[f] !== undefined) btn.textContent = `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`;
    });
  }

  renderCommitmentsFull('all');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCommitmentsFull(btn.dataset.filter);
    });
  });

  // ══════════════ ADD COMMITMENT MODAL ══════════════
  document.getElementById('addCommitmentBtn')?.addEventListener('click', openAddCommitmentModal);

  function openAddCommitmentModal() {
    closeAllModals();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>➕ New Commitment</h3>
          <button class="modal-close" id="modalClose">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>What needs to be done?</label>
            <input type="text" id="newCommitWhat" placeholder="e.g. Send proposal to client" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Who</label>
              <input type="text" id="newCommitWho" placeholder="e.g. You → Sneha" class="form-input" />
            </div>
            <div class="form-group">
              <label>Deadline</label>
              <input type="text" id="newCommitDeadline" placeholder="e.g. Tomorrow" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Priority</label>
              <select id="newCommitPriority" class="form-input">
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div class="form-group">
              <label>Direction</label>
              <select id="newCommitDirection" class="form-input">
                <option value="outgoing">You owe (outgoing)</option>
                <option value="incoming">They owe (incoming)</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-sm btn-outline" id="modalCancel">Cancel</button>
          <button class="btn-sm btn-primary" id="modalSave">✓ Add Commitment</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    overlay.querySelector('#modalClose').addEventListener('click', closeAllModals);
    overlay.querySelector('#modalCancel').addEventListener('click', closeAllModals);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
    overlay.querySelector('#modalSave').addEventListener('click', saveNewCommitment);
    overlay.querySelector('#newCommitWhat').focus();
  }

  function saveNewCommitment() {
    const what = document.getElementById('newCommitWhat').value.trim();
    const who = document.getElementById('newCommitWho').value.trim() || 'You';
    const deadline = document.getElementById('newCommitDeadline').value.trim() || 'No deadline';
    const priority = document.getElementById('newCommitPriority').value;
    const direction = document.getElementById('newCommitDirection').value;
    if (!what) { showToast('Please enter what needs to be done', 'warning'); return; }

    const newCommit = {
      id: 'c' + Date.now(),
      what, who, direction, deadline,
      source: 'Manual entry — Today',
      status: 'pending',
      timeBlocked: 'Not yet blocked',
      priority,
      notes: ''
    };
    FLOW_DATA.commitments.unshift(newCommit);
    closeAllModals();
    showToast(`➕ Added: "${what}"`, 'success');
    renderDashboardCommitments();
    renderCommitmentsFull(FLOW_STATE.commitmentFilter);
    updateStats();
    updateFilterCounts();
    addAiDecision('block', 'New Task', `User created new commitment: <strong>"${what}"</strong>. Looking for available time slot to block.`);
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(el => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    });
  }

  // ══════════════ RENDER EMAILS (Dashboard) ══════════════
  function renderDashboardEmails() {
    const el = document.getElementById('emailList');
    el.innerHTML = '';
    const visible = FLOW_DATA.emails.filter(e => !e.archived);
    visible.forEach((email) => {
      const div = document.createElement('div');
      div.className = `email-item ${email.unread ? 'unread' : ''}`;
      div.innerHTML = `
        <div class="email-avatar" style="background:${email.color}">${email.initials}</div>
        <div class="email-body">
          <div class="email-sender">${email.from}${email.starred ? ' ⭐' : ''}<span class="email-time">${email.time}</span></div>
          <div class="email-subject">${email.subject}</div>
          <span class="email-intent intent-${email.intent}">✦ ${email.intentLabel}</span>
        </div>
      `;
      div.addEventListener('click', () => {
        email.unread = false;
        renderDashboardEmails();
        navigateTo('emails');
        updateStats();
        setTimeout(() => {
          const card = document.querySelector(`[data-email-id="${email.id}"]`);
          if (card) { card.classList.add('expanded'); card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        }, 100);
      });
      el.appendChild(div);
    });
  }
  renderDashboardEmails();

  // Email filter chips on dashboard
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.textContent.toLowerCase().trim();
      const el = document.getElementById('emailList');
      el.innerHTML = '';
      let filtered = FLOW_DATA.emails.filter(e => !e.archived);
      if (filter === 'meetings') filtered = filtered.filter(e => e.intent === 'meeting');
      else if (filter === 'deadlines') filtered = filtered.filter(e => e.intent === 'deadline' || e.intent === 'commitment');
      filtered.forEach(email => {
        const div = document.createElement('div');
        div.className = `email-item ${email.unread ? 'unread' : ''}`;
        div.innerHTML = `
          <div class="email-avatar" style="background:${email.color}">${email.initials}</div>
          <div class="email-body">
            <div class="email-sender">${email.from}<span class="email-time">${email.time}</span></div>
            <div class="email-subject">${email.subject}</div>
            <span class="email-intent intent-${email.intent}">✦ ${email.intentLabel}</span>
          </div>
        `;
        div.addEventListener('click', () => { navigateTo('emails'); });
        el.appendChild(div);
      });
    });
  });

  // ══════════════ EMAIL DETAIL PAGE ══════════════
  function renderEmailDetailPage() {
    const el = document.getElementById('emailDetailList');
    el.innerHTML = '';
    let filtered = FLOW_DATA.emails.filter(e => !e.archived);

    filtered.forEach((email, i) => {
      const div = document.createElement('div');
      div.className = 'email-detail-card';
      div.dataset.emailId = email.id;
      div.style.animation = `slideUp 0.4s ease ${i * 0.08}s both`;
      const ext = email.aiExtraction;
      div.innerHTML = `
        <div class="email-detail-header">
          <div class="email-avatar" style="background:${email.color};width:42px;height:42px;font-size:0.85rem;">${email.initials}</div>
          <div>
            <div class="email-detail-from">${email.from} ${email.starred ? '⭐' : ''} ${email.unread ? '<span class="unread-dot"></span>' : ''}</div>
            <div class="email-detail-subject">${email.subject}</div>
          </div>
          <span class="email-time" style="margin-left:auto;font-size:0.8rem;">${email.time}</span>
        </div>
        <div class="email-detail-body">${email.body}</div>
        <div class="email-actions-bar">
          <button class="btn-sm btn-primary btn-reply" data-id="${email.id}">↩ Reply</button>
          <button class="btn-sm btn-outline btn-star" data-id="${email.id}">${email.starred ? '★ Starred' : '☆ Star'}</button>
          <button class="btn-sm btn-outline btn-archive" data-id="${email.id}">📦 Archive</button>
          ${!email.replied ? `<button class="btn-sm btn-outline btn-accept-action" data-id="${email.id}">✦ Accept AI Action</button>` : '<span class="replied-badge">↩ Replied</span>'}
        </div>
        <div class="ai-extraction">
          <div class="ai-extraction-title">FLOW AI Extraction (via Gemini)</div>
          <div class="ai-extraction-content">
            <div class="ai-field"><div class="ai-field-label">Intent Type</div><div class="ai-field-value">${ext.intent_type}</div></div>
            <div class="ai-field"><div class="ai-field-label">Extracted Detail</div><div class="ai-field-value">${ext.extracted_detail}</div></div>
            <div class="ai-field"><div class="ai-field-label">Proposed Action</div><div class="ai-field-value">${ext.proposed_action}</div></div>
            <div class="ai-field"><div class="ai-field-label">Calendar Slot</div><div class="ai-field-value">${ext.calendar_slot}</div></div>
            <div class="ai-field"><div class="ai-field-label">Follow-up</div><div class="ai-field-value">${ext.follow_up_required ? '✅ Yes' : '❌ No'}</div></div>
            <div class="ai-field"><div class="ai-field-label">Follow-up Date</div><div class="ai-field-value">${ext.follow_up_date || 'N/A'}</div></div>
          </div>
        </div>
      `;
      el.appendChild(div);
    });

    // Bind email action buttons
    el.querySelectorAll('.btn-reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const email = FLOW_DATA.emails.find(x => x.id === btn.dataset.id);
        email.replied = true;
        showToast(`↩ Reply sent to ${email.from}`, 'success');
        renderEmailDetailPage();
        addAiDecision('schedule', 'Reply Sent', `User replied to <strong>${email.from}</strong> regarding "${email.subject}".`);
      });
    });
    el.querySelectorAll('.btn-star').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const email = FLOW_DATA.emails.find(x => x.id === btn.dataset.id);
        email.starred = !email.starred;
        showToast(email.starred ? `⭐ Starred: ${email.from}` : `Unstarred: ${email.from}`, 'info');
        renderEmailDetailPage();
        renderDashboardEmails();
      });
    });
    el.querySelectorAll('.btn-archive').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const email = FLOW_DATA.emails.find(x => x.id === btn.dataset.id);
        email.archived = true;
        showToast(`📦 Archived: "${email.subject}"`, 'info');
        renderEmailDetailPage();
        renderDashboardEmails();
        updateStats();
      });
    });
    el.querySelectorAll('.btn-accept-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const email = FLOW_DATA.emails.find(x => x.id === btn.dataset.id);
        showToast(`🤖 AI Action accepted: ${email.aiExtraction.proposed_action}`, 'ai', 4000);
        addAiDecision('schedule', 'Action Accepted', `User approved AI-proposed action for <strong>${email.from}</strong>: ${email.aiExtraction.proposed_action}`);
      });
    });
  }
  renderEmailDetailPage();

  // ══════════════ AI LOG ══════════════
  function addAiDecision(action, label, desc) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const newDecision = { id: 'ai' + Date.now(), action, actionLabel: label, time: timeStr, description: desc, reasoning: 'Auto-generated based on user action.', approved: true };
    FLOW_DATA.aiDecisions.unshift(newDecision);
    renderDashboardAiLog();
    renderFullAiLog();
  }

  function renderDashboardAiLog() {
    const el = document.getElementById('aiLog');
    el.innerHTML = '';
    FLOW_DATA.aiDecisions.slice(0, 5).forEach((d) => {
      const div = document.createElement('div');
      div.className = 'ai-log-item';
      div.innerHTML = `
        <div class="ai-log-header">
          <span class="ai-log-action action-${d.action}">${d.actionLabel}</span>
          <span class="ai-log-time">${d.time}</span>
        </div>
        <div class="ai-log-desc">${d.description}</div>
      `;
      el.appendChild(div);
    });
  }

  function renderFullAiLog() {
    const el = document.getElementById('aiFullLog');
    el.innerHTML = '';
    FLOW_DATA.aiDecisions.forEach((d, i) => {
      const div = document.createElement('div');
      div.className = 'ai-full-log-item';
      div.style.animation = `slideUp 0.4s ease ${i * 0.06}s both`;
      div.innerHTML = `
        <div class="ai-full-log-header">
          <span class="ai-log-action action-${d.action}">${d.actionLabel}</span>
          <span class="ai-log-time">${d.time}</span>
          ${d.approved !== null ? `<span class="ai-approval ${d.approved ? 'approved' : 'pending'}">${d.approved ? '✓ Approved' : '⏳ Pending'}</span>` : ''}
        </div>
        <div class="ai-full-log-desc">${d.description}</div>
        <div class="ai-reasoning">${d.reasoning}</div>
        ${d.approved === null ? `<div class="ai-decision-btns"><button class="btn-sm btn-primary btn-approve-ai" data-id="${d.id}">✓ Approve</button><button class="btn-sm btn-outline btn-reject-ai" data-id="${d.id}">✕ Reject</button></div>` : ''}
      `;
      el.appendChild(div);
    });
    el.querySelectorAll('.btn-approve-ai').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = FLOW_DATA.aiDecisions.find(x => x.id === btn.dataset.id);
        d.approved = true;
        showToast('✅ AI decision approved', 'success');
        renderFullAiLog();
        renderDashboardAiLog();
      });
    });
    el.querySelectorAll('.btn-reject-ai').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = FLOW_DATA.aiDecisions.find(x => x.id === btn.dataset.id);
        d.approved = false;
        showToast('❌ AI decision rejected — action reverted', 'warning');
        renderFullAiLog();
        renderDashboardAiLog();
      });
    });
  }
  renderDashboardAiLog();
  renderFullAiLog();

  // ══════════════ CALENDAR ══════════════
  function renderCalendar() {
    const el = document.getElementById('calendarDayView');
    el.innerHTML = '';
    for (let h = 7; h <= 19; h++) {
      const hourDiv = document.createElement('div');
      hourDiv.className = 'calendar-hour';
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayHour = h > 12 ? h - 12 : h;
      hourDiv.innerHTML = `<div class="calendar-hour-label">${displayHour}:00 ${ampm}</div><div class="calendar-hour-content" id="cal-hour-${h}"></div>`;
      el.appendChild(hourDiv);
      const events = FLOW_DATA.calendarEvents[h];
      if (events) {
        const contentEl = hourDiv.querySelector('.calendar-hour-content');
        events.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.className = `calendar-event ${event.type}`;
          eventDiv.innerHTML = `<div>${event.title}</div><div class="calendar-event-time">${event.time}</div>`;
          eventDiv.style.cursor = 'pointer';
          eventDiv.addEventListener('click', () => {
            showToast(`📅 ${event.title} — ${event.time}`, 'info');
          });
          contentEl.appendChild(eventDiv);
        });
      }
    }
  }
  renderCalendar();

  // ══════════════ WHATSAPP ══════════════
  const waMessagesEl = document.getElementById('whatsappMessages');
  FLOW_DATA.whatsappMessages.forEach((msg, i) => {
    const div = document.createElement('div');
    div.className = `wa-msg ${msg.type}`;
    div.style.animationDelay = `${i * 0.15}s`;
    div.innerHTML = `<div style="white-space:pre-wrap">${msg.text}</div><div class="wa-msg-time">${msg.time}</div>`;
    waMessagesEl.appendChild(div);
  });

  const waInput = document.getElementById('waInput');
  const waSend = document.getElementById('waSend');

  const aiResponses = {
    'reschedule': "Done! ✅ I've rescheduled the meeting. Calendar updated and notification sent to the other party.",
    'cancel': "Got it! 🚫 Meeting cancelled. I've notified all attendees and freed up that time slot.",
    'remind': "Reminder set! 🔔 I'll ping you at the specified time.",
    'block': "Blocked! 🔒 That time slot is now protected. No meetings will be scheduled there.",
    'status': `📊 Here's your current status:\n\n✅ ${FLOW_DATA.commitments.filter(c => c.status === 'done').length} completed\n⏳ ${FLOW_DATA.commitments.filter(c => c.status === 'pending').length} pending\n⚠️ ${FLOW_DATA.commitments.filter(c => c.status === 'overdue').length} overdue\n\nYou're doing great! 🚀`,
    'default': [
      "Got it! ✅ I've updated your calendar accordingly. Any other changes?",
      "Done! 📅 Calendar updated and all conflicts have been resolved.",
      "Noted! 📝 I've added this to your commitments and blocked the appropriate time.",
      "Perfect! I've rescheduled that and sent a notification. ✉️",
      "Understood! 🔒 That time slot is now protected."
    ]
  };

  function generateAiResponse(text) {
    const lower = text.toLowerCase();
    if (lower.includes('reschedule') || lower.includes('move')) return aiResponses.reschedule;
    if (lower.includes('cancel')) return aiResponses.cancel;
    if (lower.includes('remind')) return aiResponses.remind;
    if (lower.includes('block') || lower.includes('protect')) return aiResponses.block;
    if (lower.includes('status') || lower.includes('how') || lower.includes('update')) return aiResponses.status;
    return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
  }

  function sendWaMessage() {
    const text = waInput.value.trim();
    if (!text) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'wa-msg outgoing';
    userMsg.innerHTML = `<div>${text}</div><div class="wa-msg-time">Just now</div>`;
    waMessagesEl.appendChild(userMsg);
    waInput.value = '';
    waMessagesEl.scrollTop = waMessagesEl.scrollHeight;

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'wa-msg incoming wa-typing';
    typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    waMessagesEl.appendChild(typing);
    waMessagesEl.scrollTop = waMessagesEl.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const aiMsg = document.createElement('div');
      aiMsg.className = 'wa-msg incoming';
      aiMsg.innerHTML = `<div style="white-space:pre-wrap">${generateAiResponse(text)}</div><div class="wa-msg-time">Just now</div>`;
      waMessagesEl.appendChild(aiMsg);
      waMessagesEl.scrollTop = waMessagesEl.scrollHeight;
    }, 1200);
  }

  waSend.addEventListener('click', sendWaMessage);
  waInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendWaMessage(); });

  // ══════════════ SEARCH ══════════════
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) return;
    // Quick navigate on Enter
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.toLowerCase().trim();
      if (!q) return;
      const emailMatch = FLOW_DATA.emails.find(e => e.from.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q));
      if (emailMatch) { navigateTo('emails'); showToast(`Found: "${emailMatch.subject}"`, 'info'); return; }
      const commitMatch = FLOW_DATA.commitments.find(c => c.what.toLowerCase().includes(q) || c.who.toLowerCase().includes(q));
      if (commitMatch) { navigateTo('commitments'); showToast(`Found: "${commitMatch.what}"`, 'info'); return; }
      showToast(`No results for "${q}"`, 'warning');
    }
  });

  // ══════════════ COMMAND PALETTE (Cmd+K) ══════════════
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape') closeAllModals();
  });

  function openCommandPalette() {
    closeAllModals();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay cmd-palette-overlay';
    overlay.id = 'modalOverlay';
    overlay.innerHTML = `
      <div class="cmd-palette">
        <div class="cmd-palette-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;color:var(--text-muted)"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" id="cmdInput" placeholder="Type a command..." autofocus />
          <span class="cmd-shortcut">ESC</span>
        </div>
        <div class="cmd-results" id="cmdResults"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });

    const cmdInput = document.getElementById('cmdInput');
    const cmdResults = document.getElementById('cmdResults');

    function renderCmdResults(query) {
      cmdResults.innerHTML = '';
      let actions = FLOW_DATA.quickActions;
      if (query) actions = actions.filter(a => a.label.toLowerCase().includes(query) || a.keywords.includes(query));
      actions.forEach(a => {
        const div = document.createElement('div');
        div.className = 'cmd-result-item';
        div.innerHTML = `<span class="cmd-result-icon">${a.icon}</span><span>${a.label}</span>`;
        div.addEventListener('click', () => executeCmdAction(a));
        cmdResults.appendChild(div);
      });
    }
    renderCmdResults('');
    cmdInput.addEventListener('input', () => renderCmdResults(cmdInput.value.toLowerCase().trim()));
    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = cmdResults.querySelector('.cmd-result-item');
        if (first) first.click();
      }
    });
  }

  function executeCmdAction(action) {
    closeAllModals();
    if (action.action === 'navigate') { navigateTo(action.target); }
    else if (action.action === 'addCommitment') { openAddCommitmentModal(); }
    else if (action.action === 'markAllRead') {
      FLOW_DATA.emails.forEach(e => e.unread = false);
      showToast('📭 All emails marked as read', 'success');
      renderDashboardEmails();
      renderEmailDetailPage();
      updateStats();
    }
    else if (action.action === 'sendBriefing') { showToast('📨 WhatsApp briefing sent!', 'ai'); }
    else if (action.action === 'addEvent') { showToast('🗓️ Use the calendar page to add events', 'info'); }
  }

  // ══════════════ USER PROFILE DROPDOWN ══════════════
  document.getElementById('userAvatar').addEventListener('click', (e) => {
    e.stopPropagation();
    let dropdown = document.getElementById('profileDropdown');
    if (dropdown) { dropdown.remove(); return; }
    dropdown = document.createElement('div');
    dropdown.id = 'profileDropdown';
    dropdown.className = 'profile-dropdown';
    dropdown.innerHTML = `
      <div class="profile-info">
        <div class="profile-avatar-lg">${FLOW_DATA.user.initials}</div>
        <div><div class="profile-name">${FLOW_DATA.user.name}</div><div class="profile-email">${FLOW_DATA.user.email}</div></div>
      </div>
      <div class="profile-divider"></div>
      <div class="profile-item" id="profilePlan">⚡ Plan: <strong>${FLOW_DATA.user.plan}</strong></div>
      <div class="profile-item" id="profileRole">💼 ${FLOW_DATA.user.role}</div>
      <div class="profile-divider"></div>
      <div class="profile-item profile-item-action" id="profileKeyboard">⌨️ Keyboard Shortcuts</div>
      <div class="profile-item profile-item-action" id="profileCmdK">🔍 Command Palette (⌘K)</div>
      <div class="profile-divider"></div>
      <div class="profile-item profile-item-danger" id="profileLogout">🚪 Sign Out</div>
    `;
    document.querySelector('.topbar-right').appendChild(dropdown);
    dropdown.querySelector('#profileKeyboard').addEventListener('click', () => {
      dropdown.remove();
      showToast('⌨️ Shortcuts: ⌘K = Command Palette, Esc = Close modals', 'info', 5000);
    });
    dropdown.querySelector('#profileCmdK').addEventListener('click', () => {
      dropdown.remove();
      openCommandPalette();
    });
    dropdown.querySelector('#profileLogout').addEventListener('click', () => {
      dropdown.remove();
      showToast('🔒 Signed out successfully (demo mode)', 'info');
    });
    document.addEventListener('click', function closeProfile(ev) {
      if (!dropdown.contains(ev.target)) { dropdown.remove(); document.removeEventListener('click', closeProfile); }
    });
  });

  // ══════════════ LIVE STATS COUNTER ANIMATION ══════════════
  animateCounter('statEmails', 0, 12, 1500);
  animateCounter('statCommitments', 0, 7, 1200);
  animateCounter('statMeetings', 0, 4, 1000);
  animateCounterText('statTimeSaved', 0, 2.4, 1800, 'h');

  function animateCounter(id, start, end, duration) {
    const el = document.getElementById(id);
    const range = end - start; const startTime = performance.now();
    function update(t) { const p = Math.min((t - startTime) / duration, 1); el.textContent = Math.round(start + range * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(update); }
    requestAnimationFrame(update);
  }
  function animateCounterText(id, start, end, duration, suffix) {
    const el = document.getElementById(id);
    const range = end - start; const startTime = performance.now();
    function update(t) { const p = Math.min((t - startTime) / duration, 1); el.textContent = (start + range * (1 - Math.pow(1 - p, 3))).toFixed(1) + suffix; if (p < 1) requestAnimationFrame(update); }
    requestAnimationFrame(update);
  }

  // ══════════════ LIVE ACTIVITY SIMULATION ══════════════
  setInterval(() => {
    const actions = [
      { action: 'schedule', label: 'Scheduled', desc: 'Auto-scheduled <strong>follow-up call</strong> with Rahul for next Tuesday.' },
      { action: 'resolve', label: 'Resolved', desc: 'Detected scheduling conflict and <strong>auto-resolved</strong> by shifting blocks.' },
      { action: 'followup', label: 'Follow-up', desc: 'Sent WhatsApp reminder to <strong>Priya</strong> about pending mockups.' },
      { action: 'block', label: 'Blocked', desc: 'Protected <strong>deep work</strong> slot — rejected incoming meeting request.' },
    ];
    const r = actions[Math.floor(Math.random() * actions.length)];
    addAiDecision(r.action, r.label, r.desc);
  }, 45000);

  // Scroll to current timeline item
  setTimeout(() => {
    const cur = document.querySelector('.timeline-item.current');
    if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 500);

  console.log('🚀 FLOW Dashboard v2.0 loaded — fully interactive prototype');
});
