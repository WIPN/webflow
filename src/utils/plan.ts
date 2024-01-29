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
  const relevantPlans = member.planConnections.filter(pc =>
    (pc.active || pc.status === "TRIALING") && pc.payment && pc.payment.nextBillingDate
  );

  // Sort by nextBillingDate descending (most recent first)
  const sortedPlans = relevantPlans.sort((a, b) => b.payment.nextBillingDate - a.payment.nextBillingDate);

  // Take the first plan (most recent one)
  const currentPlan = sortedPlans[0];

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

/****************** */

interface PlanConnection {
  active: boolean;
  status: string;
  payment?: {
    amount: number;
    nextBillingDate: number; // Unix timestamp
  };
}

interface MemberData {
  planConnections: PlanConnection[];
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  console.log('date', date.toLocaleDateString('en-US', options));
  return date.toLocaleDateString('en-US', options);
}

function updatePlanDetails(
  member: MemberData,
  priceSelector: string = '[data-element="plan-price"]',
  renewalSelector: string = '[data-element="plan-renewal"]'
): void {
  console.log('plan member', member);
  const activePlans = member.planConnections.filter((pc) => pc.active);
  console.log('active plans', activePlans);
  const currentPlan = activePlans[0]; // Assuming the first active plan is the current plan
  console.log(currentPlan);

  const priceElement = document.querySelector(priceSelector);
  const renewalElement = document.querySelector(renewalSelector);

  if (priceElement) {
    priceElement.textContent =
      currentPlan && currentPlan.payment ? `$${currentPlan.payment.amount}` : 'Free';
  }

  if (renewalElement) {
    renewalElement.textContent =
      currentPlan && currentPlan.payment && currentPlan.payment.nextBillingDate
        ? formatDate(currentPlan.payment.nextBillingDate)
        : 'N/A';
  }
}

export { updatePlanDetails };
