import { formatCurrency } from './helpers';

export const generateInsights = (transactions, habits, tasks) => {
  const insights = [];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentMonth = today.getMonth();

  // ==========================================
  // 1. FINANCIAL ANALYSIS
  // ==========================================
  const thisMonthTx = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
  const todaysTx = transactions.filter(t => new Date(t.date).toLocaleDateString() === today.toLocaleDateString());

  const income = thisMonthTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = thisMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const spentToday = todaysTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  // A. Negative Cashflow (Critical)
  if (expense > income && income > 0) {
    insights.push({
      type: 'danger',
      weight: 10, // Highest Priority
      title: 'Financial Warning',
      message: `You have spent ${formatCurrency(Math.abs(income - expense))} more than you earned this month.`
    });
  }

  // B. High Daily Spending (Warning)
  // Threshold set to 2000, can be dynamic based on income/30 in future
  if (spentToday > 2000) {
    insights.push({
      type: 'warning',
      weight: 8,
      title: 'High Spending Detected',
      message: `You've spent ${formatCurrency(spentToday)} today. Consider slowing down if this wasn't planned.`
    });
  }

  // C. Savings Rate (Success/Warning)
  if (income > expense) {
    const savingsRate = ((income - expense) / income) * 100;
    if (savingsRate > 20) {
      insights.push({
        type: 'success',
        weight: 2, // Low Priority (Good news is nice, but warnings come first)
        title: 'Wealth Builder',
        message: `Great job! You're saving ${Math.round(savingsRate)}% of your income this month.`
      });
    }
  }

  // ==========================================
  // 2. TASK ANALYSIS
  // ==========================================
  const overdueTasks = tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date().setHours(0,0,0,0));
  const highPriorityPending = tasks.filter(t => !t.isCompleted && t.priority === 'High');

  // A. Overdue Tasks (Critical)
  if (overdueTasks.length > 0) {
    insights.push({
      type: 'danger',
      weight: 9,
      title: 'Overdue Alert',
      message: `You have ${overdueTasks.length} tasks past their deadline. Clear them out!`
    });
  }

  // B. Task Overload (Warning)
  if (highPriorityPending.length > 3) {
    insights.push({
      type: 'warning',
      weight: 7,
      title: 'Focus Required',
      message: `You have ${highPriorityPending.length} High Priority tasks. Don't multitask—tackle one at a time.`
    });
  }

  // ==========================================
  // 3. HABIT ANALYSIS
  // ==========================================
  if (habits.length > 0) {
    const doneToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
    // Habits that have a streak > 2 but are NOT done today
    const streaksAtRisk = habits.filter(h => h.streak > 2 && !h.completedDates.includes(todayStr));

    // A. Perfect Day (Success)
    if (doneToday === habits.length) {
      insights.push({
        type: 'success',
        weight: 5,
        title: 'Unstoppable',
        message: 'You completed every single habit today. Enjoy your momentum!'
      });
    }
    // B. Streak Protection (Warning)
    else if (streaksAtRisk.length > 0) {
      insights.push({
        type: 'warning',
        weight: 6,
        title: 'Streaks at Risk',
        message: `You have ${streaksAtRisk.length} active habits pending. Don't break the chain!`
      });
    }
  }

  // ==========================================
  // 4. FALLBACK
  // ==========================================
  if (insights.length === 0) {
    return {
      type: 'info',
      title: 'All Systems Normal',
      message: 'Your life is balanced. Check your Goals to see what to aim for next.'
    };
  }

  // Sort by weight (Highest first) and return the top one
  return insights.sort((a, b) => b.weight - a.weight)[0];
};