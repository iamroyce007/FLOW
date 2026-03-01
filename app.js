/* ═══════════════════════════════════════════════════
   FLOW — Main Application Logic
   Renders dashboard, handles navigation, animations
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── GREETING ──
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';
    document.getElementById('greetingText').textContent = `${greeting}, ${FLOW_DATA.user.name}`;

    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('greetingSub').textContent =
        `${today.toLocaleDateString('en-US', options)} — 3 conflicts resolved overnight`;

    // ── NAVIGATION ──
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            pages.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`page-${page}`);
            if (target) {
                target.classList.add('active');
                // Re-trigger animation
                target.style.animation = 'none';
                target.offsetHeight; // trigger reflow
                target.style.animation = '';
            }
        });
    });

    // View All Commitments button
    document.getElementById('viewAllCommitments').addEventListener('click', () => {
        document.querySelector('[data-page="commitments"]').click();
    });

    // ── MOBILE MENU ──
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // ── RENDER TIMELINE ──
    const timelineEl = document.getElementById('timeline');
    FLOW_DATA.timeline.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = `timeline-item ${item.current ? 'current' : ''}`;
        div.style.animationDelay = `${0.3 + i * 0.05}s`;
        div.innerHTML = `
      <span class="timeline-time">${item.time}</span>
      <span class="timeline-dot ${item.type} ${item.current ? 'current' : ''}"></span>
      <div class="timeline-info">
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-subtitle">${item.subtitle}</div>
      </div>
      <span class="timeline-tag tag-${item.type}">${item.tag}</span>
    `;
        timelineEl.appendChild(div);
    });

    // ── RENDER COMMITMENTS (Dashboard) ──
    const commitmentListEl = document.getElementById('commitmentList');
    FLOW_DATA.commitments.slice(0, 5).forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'commitment-item';
        div.style.animationDelay = `${0.3 + i * 0.06}s`;

        const statusIcon = {
            pending: '⏳',
            overdue: '⚠️',
            done: '✅',
            waiting: '⏳'
        }[item.status];

        div.innerHTML = `
      <div class="commitment-top">
        <span class="commitment-status status-${item.status}">${statusIcon} ${item.status}</span>
        <span class="commitment-who">${item.who}</span>
      </div>
      <div class="commitment-what">${item.what}</div>
      <div class="commitment-meta">
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${item.deadline}
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
          ${item.source}
        </span>
      </div>
    `;
        commitmentListEl.appendChild(div);
    });

    // ── RENDER COMMITMENTS (Full Page) ──
    const commitmentsFullEl = document.getElementById('commitmentsFullList');
    renderCommitmentsFull('all');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCommitmentsFull(btn.dataset.filter);
        });
    });

    function renderCommitmentsFull(filter) {
        commitmentsFullEl.innerHTML = '';
        let items = FLOW_DATA.commitments;
        if (filter !== 'all') {
            items = items.filter(c => c.status === filter);
        }

        items.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'commitment-card-full';
            div.style.animation = `slideUp 0.4s ease ${i * 0.06}s both`;

            const statusIcon = {
                pending: '⏳',
                overdue: '⚠️',
                done: '✅',
                waiting: '⏳'
            }[item.status];

            div.innerHTML = `
        <div class="commitment-card-header">
          <span class="commitment-status status-${item.status}">${statusIcon} ${item.status}</span>
          <span style="font-size:0.75rem;color:var(--text-muted)">${item.direction === 'outgoing' ? '↗ You owe' : '↙ They owe'}</span>
        </div>
        <div class="commitment-card-title">${item.what}</div>
        <div class="commitment-card-body">
          <div class="commitment-card-field">
            <span class="field-label">Who</span>
            <span>${item.who}</span>
          </div>
          <div class="commitment-card-field">
            <span class="field-label">By When</span>
            <span>${item.deadline}</span>
          </div>
          <div class="commitment-card-field">
            <span class="field-label">Source</span>
            <span>${item.source}</span>
          </div>
          <div class="commitment-card-field">
            <span class="field-label">Time</span>
            <span>${item.timeBlocked}</span>
          </div>
        </div>
        <div class="commitment-card-actions">
          <button class="btn-sm btn-primary">${item.status === 'overdue' ? 'Action Now' : 'Mark Done'}</button>
          <button class="btn-sm btn-outline">Reschedule</button>
        </div>
      `;
            commitmentsFullEl.appendChild(div);
        });
    }

    // ── RENDER EMAIL LIST (Dashboard) ──
    const emailListEl = document.getElementById('emailList');
    FLOW_DATA.emails.forEach((email, i) => {
        const div = document.createElement('div');
        div.className = `email-item ${email.unread ? 'unread' : ''}`;
        div.innerHTML = `
      <div class="email-avatar" style="background:${email.color}">${email.initials}</div>
      <div class="email-body">
        <div class="email-sender">
          ${email.from}
          <span class="email-time">${email.time}</span>
        </div>
        <div class="email-subject">${email.subject}</div>
        <span class="email-intent intent-${email.intent}">✦ ${email.intentLabel}</span>
      </div>
    `;
        emailListEl.appendChild(div);
    });

    // ── RENDER EMAIL DETAIL PAGE ──
    const emailDetailEl = document.getElementById('emailDetailList');
    FLOW_DATA.emails.forEach((email, i) => {
        const div = document.createElement('div');
        div.className = 'email-detail-card';
        div.style.animation = `slideUp 0.4s ease ${i * 0.08}s both`;

        const ext = email.aiExtraction;
        div.innerHTML = `
      <div class="email-detail-header">
        <div class="email-avatar" style="background:${email.color};width:42px;height:42px;font-size:0.85rem;">${email.initials}</div>
        <div>
          <div class="email-detail-from">${email.from}</div>
          <div class="email-detail-subject">${email.subject}</div>
        </div>
        <span class="email-time" style="margin-left:auto;font-size:0.8rem;">${email.time}</span>
      </div>
      <div class="email-detail-body">${email.body}</div>
      <div class="ai-extraction">
        <div class="ai-extraction-title">FLOW AI Extraction (via Gemini)</div>
        <div class="ai-extraction-content">
          <div class="ai-field">
            <div class="ai-field-label">Intent Type</div>
            <div class="ai-field-value">${ext.intent_type}</div>
          </div>
          <div class="ai-field">
            <div class="ai-field-label">Extracted Detail</div>
            <div class="ai-field-value">${ext.extracted_detail}</div>
          </div>
          <div class="ai-field">
            <div class="ai-field-label">Proposed Action</div>
            <div class="ai-field-value">${ext.proposed_action}</div>
          </div>
          <div class="ai-field">
            <div class="ai-field-label">Calendar Slot</div>
            <div class="ai-field-value">${ext.calendar_slot}</div>
          </div>
          <div class="ai-field">
            <div class="ai-field-label">Follow-up</div>
            <div class="ai-field-value">${ext.follow_up_required ? '✅ Yes' : '❌ No'}</div>
          </div>
          <div class="ai-field">
            <div class="ai-field-label">Follow-up Date</div>
            <div class="ai-field-value">${ext.follow_up_date || 'N/A'}</div>
          </div>
        </div>
      </div>
    `;
        emailDetailEl.appendChild(div);
    });

    // ── RENDER AI LOG (Dashboard) ──
    const aiLogEl = document.getElementById('aiLog');
    FLOW_DATA.aiDecisions.slice(0, 4).forEach((decision, i) => {
        const div = document.createElement('div');
        div.className = 'ai-log-item';
        div.innerHTML = `
      <div class="ai-log-header">
        <span class="ai-log-action action-${decision.action}">${decision.actionLabel}</span>
        <span class="ai-log-time">${decision.time}</span>
      </div>
      <div class="ai-log-desc">${decision.description}</div>
    `;
        aiLogEl.appendChild(div);
    });

    // ── RENDER AI LOG (Full Page) ──
    const aiFullLogEl = document.getElementById('aiFullLog');
    FLOW_DATA.aiDecisions.forEach((decision, i) => {
        const div = document.createElement('div');
        div.className = 'ai-full-log-item';
        div.style.animation = `slideUp 0.4s ease ${i * 0.08}s both`;
        div.innerHTML = `
      <div class="ai-full-log-header">
        <span class="ai-log-action action-${decision.action}">${decision.actionLabel}</span>
        <span class="ai-log-time">${decision.time}</span>
      </div>
      <div class="ai-full-log-desc">${decision.description}</div>
      <div class="ai-reasoning">${decision.reasoning}</div>
    `;
        aiFullLogEl.appendChild(div);
    });

    // ── RENDER CALENDAR ──
    const calendarEl = document.getElementById('calendarDayView');
    for (let h = 7; h <= 19; h++) {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'calendar-hour';

        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h > 12 ? h - 12 : h;

        hourDiv.innerHTML = `
      <div class="calendar-hour-label">${displayHour}:00 ${ampm}</div>
      <div class="calendar-hour-content" id="cal-hour-${h}"></div>
    `;
        calendarEl.appendChild(hourDiv);

        // Add events
        const events = FLOW_DATA.calendarEvents[h];
        if (events) {
            const contentEl = hourDiv.querySelector('.calendar-hour-content');
            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = `calendar-event ${event.type}`;
                eventDiv.innerHTML = `
          <div>${event.title}</div>
          <div class="calendar-event-time">${event.time}</div>
        `;
                contentEl.appendChild(eventDiv);
            });
        }
    }

    // ── RENDER WHATSAPP ──
    const waMessagesEl = document.getElementById('whatsappMessages');
    FLOW_DATA.whatsappMessages.forEach((msg, i) => {
        const div = document.createElement('div');
        div.className = `wa-msg ${msg.type}`;
        div.style.animationDelay = `${i * 0.15}s`;
        div.innerHTML = `
      <div style="white-space:pre-wrap">${msg.text}</div>
      <div class="wa-msg-time">${msg.time}</div>
    `;
        waMessagesEl.appendChild(div);
    });

    // WhatsApp input handler
    const waInput = document.getElementById('waInput');
    const waSend = document.getElementById('waSend');

    function sendWaMessage() {
        const text = waInput.value.trim();
        if (!text) return;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'wa-msg outgoing';
        userMsg.innerHTML = `
      <div>${text}</div>
      <div class="wa-msg-time">Just now</div>
    `;
        waMessagesEl.appendChild(userMsg);
        waInput.value = '';

        // Auto-scroll
        waMessagesEl.scrollTop = waMessagesEl.scrollHeight;

        // Simulate FLOW response
        setTimeout(() => {
            const responses = [
                "Got it! ✅ I've updated your calendar accordingly. Any other changes?",
                "Done! 📅 Calendar updated and all conflicts have been resolved. You're all set!",
                "Noted! 📝 I've added this to your commitments and blocked the appropriate time.",
                "Perfect! I've rescheduled that and sent a notification to the other party. ✉️",
                "Understood! 🔒 That time slot is now protected. No meetings will be scheduled there."
            ];

            const aiMsg = document.createElement('div');
            aiMsg.className = 'wa-msg incoming';
            aiMsg.innerHTML = `
        <div>${responses[Math.floor(Math.random() * responses.length)]}</div>
        <div class="wa-msg-time">Just now</div>
      `;
            waMessagesEl.appendChild(aiMsg);
            waMessagesEl.scrollTop = waMessagesEl.scrollHeight;
        }, 800);
    }

    waSend.addEventListener('click', sendWaMessage);
    waInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendWaMessage();
    });

    // ── LIVE STATS COUNTER ANIMATION ──
    animateCounter('statEmails', 0, 12, 1500);
    animateCounter('statCommitments', 0, 7, 1200);
    animateCounter('statMeetings', 0, 4, 1000);
    animateCounterText('statTimeSaved', 0, 2.4, 1800, 'h');

    function animateCounter(id, start, end, duration) {
        const el = document.getElementById(id);
        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * eased);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function animateCounterText(id, start, end, duration, suffix) {
        const el = document.getElementById(id);
        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = (start + range * eased).toFixed(1);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ── LIVE ACTIVITY SIMULATION ──
    // Simulate a new AI decision every 30 seconds
    setInterval(() => {
        const actions = [
            { action: 'schedule', label: 'Scheduled', desc: 'Auto-scheduled <strong>follow-up call</strong> with Rahul for next Tuesday.' },
            { action: 'resolve', label: 'Resolved', desc: 'Detected scheduling conflict and <strong>auto-resolved</strong> by shifting blocks.' },
            { action: 'followup', label: 'Follow-up', desc: 'Sent WhatsApp reminder to <strong>Priya</strong> about pending mockups.' },
            { action: 'block', label: 'Blocked', desc: 'Protected <strong>deep work</strong> slot — rejected incoming meeting request.' },
        ];

        const random = actions[Math.floor(Math.random() * actions.length)];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        const toastEl = document.createElement('div');
        toastEl.className = 'ai-log-item';
        toastEl.style.animation = 'slideUp 0.4s ease both';
        toastEl.innerHTML = `
      <div class="ai-log-header">
        <span class="ai-log-action action-${random.action}">${random.label}</span>
        <span class="ai-log-time">${timeStr}</span>
      </div>
      <div class="ai-log-desc">${random.desc}</div>
    `;

        const aiLogContainer = document.getElementById('aiLog');
        aiLogContainer.insertBefore(toastEl, aiLogContainer.firstChild);

        // Keep max 6 items
        while (aiLogContainer.children.length > 6) {
            aiLogContainer.removeChild(aiLogContainer.lastChild);
        }
    }, 30000);

    // ── SCROLL TO CURRENT TIMELINE ITEM ──
    setTimeout(() => {
        const currentItem = document.querySelector('.timeline-item.current');
        if (currentItem) {
            currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 500);

    console.log('🚀 FLOW Dashboard loaded — AI Chief of Staff active');
});
