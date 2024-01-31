interface PaymentDetails {
  amount: number;
  nextBillingDate: number; // Unix timestamp
}

interface PlanConnection {
  active: boolean;
  status: string;
  payment?: PaymentDetails;
}

interface MemberData {
  planConnections: PlanConnection[];
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
function updatePlanDetails(
  member: MemberData,
  priceSelector: string = '[data-element="plan-price"]',
  renewalSelector: string = '[data-element="plan-renewal"]'
): void {
  // Include plans that are either active or in TRIALING status
  const relevantPlans = member.planConnections.filter(
    (pc) => (pc.active || pc.status === 'TRIALING') && pc.payment && pc.payment.nextBillingDate
  );

  // Sort by nextBillingDate descending (most recent first)
  const sortedPlans = relevantPlans.sort(
    (a, b) => b.payment.nextBillingDate - a.payment.nextBillingDate
  );

  // Take the first plan (most recent one)
  const currentPlan = sortedPlans[0];
  console.log('current', currentPlan);
  console.log('date', formatDate(currentPlan.payment.nextBillingDate));

  const priceElement = document.querySelector(priceSelector);
  const renewalElement = document.querySelector(renewalSelector);

  if (currentPlan && currentPlan.payment) {
    if (priceElement) {
      priceElement.textContent = `$${currentPlan.payment.amount}`;
    }

    if (renewalElement) {
      const formattedDate = formatDate(currentPlan.payment.nextBillingDate);
      renewalElement.textContent = formattedDate;
    }
  } else {
    // Handle case where there is no current plan or payment details
    if (priceElement) {
      priceElement.textContent = 'Free';
    }
    if (renewalElement) {
      renewalElement.textContent = 'N/A';
    }
  }
}

export { updatePlanDetails };
