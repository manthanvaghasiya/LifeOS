import { formatCurrency } from './helpers';

export const generateInsights = (transactions, habits, tasks) => {
  const insights = [];
  
  // --- 1. FINANCIAL ANALYSIS ---
  const currentMonth = new Date().getMonth();
  const thisMonthTx = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
  
  const income = thisMonthTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = thisMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  
  if (income > 0) {
    const savingsRate = ((income - expense) / income) * 100;
    
    if (savingsRate < 0) {
      insights.push({ 
        type: 'danger', 
        title: 'Financial Warning', 
        message: `You have spent ${formatCurrency(Math.abs(income - expense))} more than you earned this month.` 
      });
    } else if (savingsRate < 20) {
      insights.push({ 
        type: 'warning', 
        title: 'Tight Budget', 
        message: `You're only saving ${Math.round(savingsRate)}% of your income. Try to cut back on "Wants".` 
      });
    } else {
      insights.push({ 
        type: 'success', 
        title: 'Wealth Builder', 
        message: `Great job! You're saving ${Math.round(savingsRate)}% of your income. Consider investing the surplus.` 
      });
    }
  }

  // --- 2. HABIT ANALYSIS ---
  const today = new Date().toISOString().split('T')[0];
  const activeHabits = habits.filter(h => h.completedDates.length > 0);
  
  if (activeHabits.length > 0) {
    const doneToday = habits.filter(h => h.completedDates.includes(today)).length;
    const completionRate = (doneToday / habits.length) * 100;

    if (completionRate === 100) {
      insights.push({ 
        type: 'success', 
        title: 'Unstoppable', 
        message: 'You completed every single habit today. Enjoy your +XP!' 
      });
    } else if (completionRate < 50 && doneToday > 0) {
      insights.push({ 
        type: 'info', 
        title: 'Keep Going', 
        message: `You've done ${doneToday} habits. Finish the rest to keep your streak alive.` 
      });
    }
  }

  // --- 3. TASK ANALYSIS ---
  const overdueTasks = tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date().setHours(0,0,0,0));
  const highPriorityPending = tasks.filter(t => !t.isCompleted && t.priority === 'High');

  if (overdueTasks.length > 0) {
    insights.push({ 
      type: 'danger', 
      title: 'Overdue Alert', 
      message: `You have ${overdueTasks.length} tasks past their deadline. Clear them out!` 
    });
  } else if (highPriorityPending.length > 3) {
    insights.push({ 
      type: 'warning', 
      title: 'Focus Required', 
      message: `You have ${highPriorityPending.length} High Priority tasks. Don't multitask—tackle one at a time.` 
    });
  }

  // Default Message if everything is neutral
  if (insights.length === 0) {
    insights.push({ 
      type: 'info', 
      title: 'All Systems Normal', 
      message: 'Your life is balanced. Check your Goals to see what to aim for next.' 
    });
  }

  return insights[0]; // Return the most critical insight
};