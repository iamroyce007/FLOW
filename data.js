/* ═══════════════════════════════════════════════════
   FLOW — Mock Data Store
   Realistic demo data for the hackathon prototype
   ═══════════════════════════════════════════════════ */

const FLOW_DATA = {
  user: {
    name: "Anirudh",
    initials: "AR",
    email: "anirudh@company.com"
  },

  // ── TODAY'S SCHEDULE ──
  timeline: [
    {
      time: "8:00 AM",
      title: "Morning Routine",
      subtitle: "Protected personal block",
      type: "protected",
      tag: "Protected",
      current: false
    },
    {
      time: "9:00 AM",
      title: "Team Standup",
      subtitle: "With Engineering · Google Meet",
      type: "work",
      tag: "Work",
      current: false
    },
    {
      time: "10:00 AM",
      title: "Deep Work: Budget Doc",
      subtitle: "Auto-blocked for Sneha's commitment",
      type: "commitment",
      tag: "Commitment",
      current: false
    },
    {
      time: "11:30 AM",
      title: "1:1 with Priya",
      subtitle: "Weekly sync · Design review",
      type: "work",
      tag: "Work",
      current: false
    },
    {
      time: "1:00 PM",
      title: "Lunch Break",
      subtitle: "Protected personal block",
      type: "protected",
      tag: "Protected",
      current: false
    },
    {
      time: "2:00 PM",
      title: "Client Call: Rahul",
      subtitle: "Q1 deliverables review",
      type: "work",
      tag: "Work",
      current: true
    },
    {
      time: "3:30 PM",
      title: "Follow-up: Legal Contract",
      subtitle: "Auto-blocked — pending 3 days",
      type: "commitment",
      tag: "Commitment",
      current: false
    },
    {
      time: "4:00 PM",
      title: "Gym",
      subtitle: "Protected — cannot be overridden",
      type: "personal",
      tag: "Personal",
      current: false
    },
    {
      time: "5:30 PM",
      title: "Family Time",
      subtitle: "Protected personal block",
      type: "personal",
      tag: "Personal",
      current: false
    }
  ],

  // ── COMMITMENTS ──
  commitments: [
    {
      what: "Send budget doc to Sneha",
      who: "You → Sneha",
      direction: "outgoing",
      deadline: "Today",
      source: "Email — Feb 27",
      status: "pending",
      timeBlocked: "10:00 AM – 11:30 AM"
    },
    {
      what: "Review Karan's proposal and send feedback",
      who: "You → Karan",
      direction: "outgoing",
      deadline: "Yesterday",
      source: "Meeting — Feb 26",
      status: "overdue",
      timeBlocked: "None — past due"
    },
    {
      what: "Design mockups for dashboard v2",
      who: "Priya → You",
      direction: "incoming",
      deadline: "Today",
      source: "Slack — Feb 28",
      status: "waiting",
      timeBlocked: "N/A"
    },
    {
      what: "Contract draft for Series A",
      who: "Legal Team → You",
      direction: "incoming",
      deadline: "Friday, Mar 7",
      source: "Email — Feb 25",
      status: "waiting",
      timeBlocked: "N/A"
    },
    {
      what: "Submit hackathon video demo",
      who: "You → AMD Slingshot",
      direction: "outgoing",
      deadline: "Tomorrow",
      source: "Registration — Feb 20",
      status: "pending",
      timeBlocked: "Tomorrow 9 AM – 12 PM"
    },
    {
      what: "Update API documentation for v3",
      who: "You → Dev Team",
      direction: "outgoing",
      deadline: "Mar 5",
      source: "Meeting — Feb 28",
      status: "pending",
      timeBlocked: "Mar 4, 2 PM – 4 PM"
    },
    {
      what: "Send revised pricing to Rahul",
      who: "You → Rahul",
      direction: "outgoing",
      deadline: "Yesterday",
      source: "Email — Feb 26",
      status: "overdue",
      timeBlocked: "None — past due"
    }
  ],

  // ── EMAILS ──
  emails: [
    {
      from: "Sneha Patel",
      initials: "SP",
      color: "#6366f1",
      subject: "Can we sync on the budget doc?",
      body: "Hi Anirudh, can you send me the updated budget doc by end of day? The finance team needs it for the board meeting on Monday. Also, let's schedule a quick call to align on Q2 targets. How about Thursday at 3pm?",
      time: "9:42 AM",
      intent: "meeting",
      intentLabel: "Meeting Request",
      unread: true,
      aiExtraction: {
        intent_type: "meeting_request + deadline",
        extracted_detail: "Budget doc needed EOD + meeting request Thursday 3pm",
        proposed_action: "Block 10-11:30 AM for budget doc, schedule Thursday 3pm call",
        calendar_slot: "Today 10:00 AM & Thursday 3:00 PM",
        follow_up_required: true,
        follow_up_date: "Today 5:00 PM (if doc not sent)"
      }
    },
    {
      from: "Rahul Mehta",
      initials: "RM",
      color: "#f43f5e",
      subject: "Re: Series A — revised numbers needed",
      body: "Anirudh, the investor deck needs revised pricing by Thursday. This is blocking the fundraise timeline. Can you also loop in your finance lead? We need to align before the partner meeting on Friday.",
      time: "8:15 AM",
      intent: "deadline",
      intentLabel: "Deadline",
      unread: true,
      aiExtraction: {
        intent_type: "deadline + commitment",
        extracted_detail: "Revised pricing due Thursday, loop in finance lead",
        proposed_action: "Create commitment card, block time Wed for pricing work",
        calendar_slot: "Wednesday 2:00 PM – 4:00 PM",
        follow_up_required: true,
        follow_up_date: "Thursday 9:00 AM"
      }
    },
    {
      from: "Karan Shah",
      initials: "KS",
      color: "#f59e0b",
      subject: "Proposal attached — need your review",
      body: "Hey Anirudh, attached is the proposal for the new client onboarding flow. Would love your feedback by yesterday if possible (I know, sorry for the tight deadline!). Let me know if you need any context.",
      time: "Yesterday",
      intent: "commitment",
      intentLabel: "Commitment",
      unread: false,
      aiExtraction: {
        intent_type: "commitment",
        extracted_detail: "Proposal review needed — deadline was yesterday (OVERDUE)",
        proposed_action: "Flag as overdue, prompt immediate action, suggest 30-min block today",
        calendar_slot: "Today — urgently needs slot",
        follow_up_required: false,
        follow_up_date: null
      }
    },
    {
      from: "Priya Desai",
      initials: "PD",
      color: "#10b981",
      subject: "Design mockups — slight delay",
      body: "Hi Anirudh, the dashboard v2 mockups are taking a bit longer than expected. I'll have them to you by end of day today instead of this morning. Hope that's okay!",
      time: "7:30 AM",
      intent: "info",
      intentLabel: "Update",
      unread: true,
      aiExtraction: {
        intent_type: "commitment_update",
        extracted_detail: "Priya's mockup delivery delayed to EOD (was due this morning)",
        proposed_action: "Update waiting commitment deadline, no action needed from user",
        calendar_slot: "N/A",
        follow_up_required: true,
        follow_up_date: "Today 6:00 PM (if not delivered)"
      }
    },
    {
      from: "AMD Developer Cloud",
      initials: "AD",
      color: "#22d3ee",
      subject: "Your MI300X instance is ready",
      body: "Your AMD Instinct MI300X cloud instance has been provisioned. Access your ROCm 6.0 environment at cloud.amd.com/instances. LLaMA 3 8B is pre-loaded and ready for fine-tuning.",
      time: "6:00 AM",
      intent: "info",
      intentLabel: "Info",
      unread: false,
      aiExtraction: {
        intent_type: "none",
        extracted_detail: "Infrastructure notification — no scheduling action needed",
        proposed_action: "Archive, no calendar impact",
        calendar_slot: "N/A",
        follow_up_required: false,
        follow_up_date: null
      }
    }
  ],

  // ── AI DECISION LOG ──
  aiDecisions: [
    {
      action: "schedule",
      actionLabel: "Scheduled",
      time: "9:42 AM",
      description: 'Parsed <strong>Sneha\'s email</strong> → extracted meeting request for Thursday 3pm. Checked calendar — no conflicts. <strong>Auto-booked</strong> the slot and sent confirmation.',
      reasoning: "Email contains explicit time reference 'Thursday at 3pm' + scheduling intent keyword 'sync'. Calendar slot was open. Confidence: 94%. Action: auto-book."
    },
    {
      action: "block",
      actionLabel: "Time Blocked",
      time: "9:43 AM",
      description: 'Same email from Sneha mentions <strong>budget doc deadline (EOD)</strong>. Blocked <strong>10:00–11:30 AM</strong> as deep work time to complete it.',
      reasoning: "Commitment extracted: 'send budget doc by end of day'. No existing block for this task. Creating 90-min deep work slot in next available window (10:00 AM). Priority: HIGH — sender is direct manager."
    },
    {
      action: "resolve",
      actionLabel: "Conflict Resolved",
      time: "8:20 AM",
      description: 'Rahul requested a <strong>Friday 2pm call</strong>, but <strong>Gym (4pm)</strong> and commute buffer conflicted. Moved Rahul to <strong>Friday 11am</strong> instead.',
      reasoning: "Conflict detected: Rahul meeting (2pm) + prep time overlaps with protected 'Gym' block (4pm). User preference: gym is non-negotiable. Solution: propose 11am slot to Rahul — within business hours, no conflicts."
    },
    {
      action: "followup",
      actionLabel: "Follow-up",
      time: "8:15 AM",
      description: 'Karan\'s proposal review is <strong>1 day overdue</strong>. Drafted follow-up reminder and queued WhatsApp notification.',
      reasoning: "Commitment 'Review Karan's proposal' deadline was Feb 28. Today is Mar 1. Status: OVERDUE. Auto-generating reminder. Urgency score: 8/10 due to external stakeholder."
    },
    {
      action: "protect",
      actionLabel: "Protected",
      time: "7:00 AM",
      description: 'Rejected auto-scheduling attempt to place a meeting during <strong>Family Time (5:30 PM)</strong>. Personal blocks are <strong>sacred and non-negotiable</strong>.',
      reasoning: "Incoming scheduling request detected for 5:30 PM slot. This slot is marked as 'protected: personal'. User preference level: SACRED. Action: reject and suggest next morning slot instead."
    },
    {
      action: "schedule",
      actionLabel: "Briefing Sent",
      time: "7:00 AM",
      description: 'Generated and sent <strong>daily WhatsApp briefing</strong> with 5 commitments, 4 meetings, 3 resolved conflicts, and today\'s complete timeline.',
      reasoning: "Daily briefing trigger: 7:00 AM IST. Compiled: 2 pending commitments (you owe), 2 waiting commitments (they owe you), 4 calendar events, 3 overnight conflict resolutions. Delivered via WhatsApp Business API."
    }
  ],

  // ── WHATSAPP MESSAGES ──
  whatsappMessages: [
    {
      type: "incoming",
      text: "Good morning, Anirudh! ☀️\n\nHere's your day:\n\n📋 TODAY'S COMMITMENTS:\n✅ Send budget doc to Sneha (due today — time blocked 10:30am)\n⚠️ Review Karan's proposal (overdue by 1 day)\n\n⏳ WAITING ON OTHERS:\n⏳ Design mockups from Priya (due today)\n⏳ Contract draft from legal (due Friday)\n\n📅 YOUR SCHEDULE:\n9:00 AM — Team standup (30 mins)\n10:00 AM — Deep work: Budget doc\n11:30 AM — 1:1 with Priya\n2:00 PM — Client call: Rahul\n4:00 PM — Gym (protected 🔒)\n5:30 PM — Family time (protected 🔒)\n\n3 conflicts resolved overnight.\nHave a great day! 🚀",
      time: "7:00 AM"
    },
    {
      type: "outgoing",
      text: "Move the Rahul call to 2:30 PM instead",
      time: "7:05 AM"
    },
    {
      type: "incoming",
      text: "Done! ✅ Moved Rahul's client call from 2:00 PM → 2:30 PM. Calendar updated.\n\nThis gives you 30 extra minutes after your 1:1 with Priya — I've marked it as buffer time.",
      time: "7:05 AM"
    },
    {
      type: "outgoing",
      text: "Can you also remind me about Karan's proposal at 12?",
      time: "7:08 AM"
    },
    {
      type: "incoming",
      text: "Reminder set! 🔔 I'll ping you at 12:00 PM to review Karan's proposal.\n\nI've also blocked 12:00–12:30 PM on your calendar as a 30-min review window. The proposal PDF is attached in his original email from Feb 28.",
      time: "7:08 AM"
    }
  ],

  // ── CALENDAR EVENTS ──
  calendarEvents: {
    8: [{ title: "Morning Routine", type: "protected", time: "8:00 – 8:45 AM" }],
    9: [{ title: "Team Standup", type: "work", time: "9:00 – 9:30 AM" }],
    10: [{ title: "Deep Work: Budget Doc for Sneha", type: "commitment", time: "10:00 – 11:30 AM" }],
    11: [{ title: "1:1 with Priya — Design Review", type: "work", time: "11:30 AM – 12:00 PM" }],
    12: [{ title: "Review Karan's Proposal", type: "commitment", time: "12:00 – 12:30 PM" }],
    13: [{ title: "Lunch Break", type: "protected", time: "1:00 – 1:45 PM" }],
    14: [{ title: "Client Call: Rahul — Q1 Review", type: "work", time: "2:30 – 3:30 PM" }],
    15: [{ title: "Follow-up: Legal Contract Draft", type: "commitment", time: "3:30 – 4:00 PM" }],
    16: [{ title: "Gym 🏋️", type: "personal", time: "4:00 – 5:15 PM" }],
    17: [{ title: "Family Time 👨‍👩‍👧", type: "personal", time: "5:30 – 7:00 PM" }],
  }
};
