import { formatCurrency } from './helpers';

// Helper: Get Greeting based on time
const getTimeContext = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

// Helper: Get Date ranges
const getDateRanges = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return { today, startOfMonth };
};

export const generateInsights = (transactions, habits, tasks) => {
  const insights = [];
  const { today, startOfMonth } = getDateRanges();
  const timeContext = getTimeContext();
  const todayStr = today.toISOString().split('T')[0];

  // 1. 🧠 CONTEXTUAL "HELLO" (Morning/Evening)
 
  // Morning Briefing (High Priority if 5+ tasks)
  if (timeContext === 'morning') {
    const highPriTasks = tasks.filter(t => !t.isCompleted && t.priority === 'High');
    if (highPriTasks.length > 0) {
      insights.push({
        type: 'info',
        weight: 6, // Good baseline priority for morning
        title: 'Morning Briefing',
        message: `Rise and grind! You have ${highPriTasks.length} high-priority items to tackle first today.`
      });
    } else if (habits.length > 0) {
      insights.push({
        type: 'info',
        weight: 5,
        title: 'Morning Ritual',
        message: 'Start your day strong. Have you checked off your morning habits yet?'
      });
    }
  }

  // Evening Review (Completion Summary)
  if (timeContext === 'evening') {
    const completedToday = tasks.filter(t => t.isCompleted && new Date(t.updatedAt || new Date()).toDateString() === today.toDateString()).length;
    if (completedToday > 2) {
      insights.push({
        type: 'success',
        weight: 5,
        title: 'Productive Day',
        message: `You crushed ${completedToday} tasks today. Time to wind down and relax.`
      });
    }
  }

  // 2. 💰 DEEP FINANCIAL INTELLIGENCE

  const thisMonthTx = transactions.filter(t => new Date(t.date) >= startOfMonth);
  const income = thisMonthTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = thisMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  
  // A. Burn Rate Alert (Spending faster than days passed)
  const daysPassed = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthProgress = daysPassed / daysInMonth; // e.g., 0.5 (50%)
  
  if (income > 0) {
    const spendRatio = expense / income;
    
    // Critical: Spent 80% of income but only halfway through month
    if (spendRatio > 0.8 && monthProgress < 0.6) {
      insights.push({
        type: 'danger',
        weight: 20, // EMERGENCY PRIORITY
        title: 'Rapid Burn Rate',
        message: `Careful! You've spent 80% of your income, but the month is only half over.`
      });
    }
    // Warning: Spending > Income
    else if (expense > income) {
      insights.push({
        type: 'danger',
        weight: 15,
        title: 'Negative Cashflow',
        message: `Deficit Alert: You are ${formatCurrency(expense - income)} in the red this month.`
      });
    }
  }

  // B. Category Spike Detection (Where is money going?)
  if (expense > 0) {
    const categoryTotals = {};
    thisMonthTx.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    // Find highest spend category
    const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
    const topCatAmount = categoryTotals[topCategory];
    
    // If one category is > 40% of total expenses
    if (topCatAmount > (expense * 0.40)) {
      insights.push({
        type: 'warning',
        weight: 8,
        title: 'Spending Leak',
        message: `High Usage: ${topCategory} accounts for 40% of your spending (${formatCurrency(topCatAmount)}) this month.`
      });
    }
  }

  // 3. 🚀 PRODUCTIVITY VELOCITY

  const overdueTasks = tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date().setHours(0,0,0,0));
  
  if (overdueTasks.length > 5) {
    insights.push({
      type: 'danger',
      weight: 12,
      title: 'Task Overload',
      message: `You have ${overdueTasks.length} overdue tasks. Stop planning and start executing!`
    });
  }

  // Weekend Logic: If it's Sat/Sun and tasks are low
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  if (isWeekend && overdueTasks.length === 0) {
    insights.push({
      type: 'success',
      weight: 7,
      title: 'Weekend Vibes',
      message: 'No overdue tasks. You earned this break. Go recharge!'
    });
  }

  // 4. 🔥 HABIT STREAK MOMENTUM

  if (habits.length > 0) {
    const habitsDoneToday = habits.filter(h => h.completedDates.includes(todayStr));
    const pendingHabits = habits.filter(h => !h.completedDates.includes(todayStr));
    
    // Find the longest active streak
    const bestStreak = Math.max(...habits.map(h => h.streak || 0));
    const bestHabit = habits.find(h => h.streak === bestStreak);

    // A. Big Milestone
    if (bestStreak > 0 && bestStreak % 7 === 0 && habitsDoneToday.find(h => h._id === bestHabit._id)) {
      insights.push({
        type: 'success',
        weight: 10,
        title: 'Consistency King',
        message: `🔥 ${bestStreak} Day Streak on "${bestHabit.title}"! You are building a lifestyle.`
      });
    }

    // B. Danger Zone (Streak at risk late in the day)
    if (timeContext === 'evening' && bestStreak > 3 && pendingHabits.find(h => h._id === bestHabit._id)) {
      insights.push({
        type: 'warning',
        weight: 11,
        title: 'Streak at Risk',
        message: `Don't lose your ${bestStreak}-day streak on "${bestHabit.title}". Do it now!`
      });
    }
  }

  // 5. FALLBACK & SELECTION

  if (insights.length === 0) {
    const genericMsg = [
      "Small steps every day lead to big results.",
      "Review your goals to stay aligned with your vision.",
      "Track every expense to master your wealth.",
      "Consistency is the key to mastery."
    ];
    const randomMsg = genericMsg[Math.floor(Math.random() * genericMsg.length)];
    
    return {
      type: 'info',
      title: 'LifeOS Insight',
      message: randomMsg
    };
  }

  // Sort by weight descending
  return insights.sort((a, b) => b.weight - a.weight)[0];
};
