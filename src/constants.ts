import { Buyer, BuyerSignal, Campaign, Message, SKU } from './types';

export const USER_PROFILE = {
  name: 'Alex Rossi',
  role: 'Account Manager',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
};

export const MOCK_SKUS: SKU[] = [
  { id: '1', name: 'Alba White Truffles', category: 'Mushrooms', price: 1200, suggestedQty: 1 },
  { id: '2', name: 'Castillo de Canena EVOO', category: 'Oil', price: 45, suggestedQty: 12 },
  { id: '3', name: 'Iberico Bellota Ham', category: 'Charcuterie', price: 350, suggestedQty: 2 },
  { id: '4', name: 'Manchego Viejo (12mo)', category: 'Cheese', price: 28, suggestedQty: 5 },
  { id: '5', name: 'Fleur de Sel (Camargue)', category: 'Pantry', price: 12, suggestedQty: 20 },
  { id: '6', name: 'Balsamic Modena Gold', category: 'Vinegar', price: 85, suggestedQty: 6 },
  { id: '7', name: 'Cantabrian Anchovies', category: 'Pantry', price: 18, suggestedQty: 24 },
  { id: '8', name: 'Greek Red Saffron', category: 'Spices', price: 65, suggestedQty: 10 },
  { id: '9', name: 'Piquillo Peppers (Navarra)', category: 'Pantry', price: 8, suggestedQty: 48 },
  { id: '10', name: 'Mediterranean Pine Nuts', category: 'Nuts', price: 42, suggestedQty: 5 },
];

export const MOCK_BUYERS: Buyer[] = [
  {
    id: 'b1',
    name: 'Sarah Jenkins',
    company: 'Blue Hill Farm',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    email: 'sarah@bluehill.com',
    location: 'New York, NY',
    preferences: ['Organic', 'Rare Varietals', 'European Imports'],
    relationshipNotes: 'Prefers morning calls. Very detail-oriented about acidity levels in oils. Always looking for unique truffle varietals.',
    tone: 'Direct',
    signals: ['VIP', 'Birthday', 'Frequent'],
    engagementScore: 92,
    importantDates: [
      { label: 'Birthday', date: 'May 12' },
      { label: 'Project Launch', date: 'June 1' }
    ],
    acceptedSubstitutions: ['Castillo Oil for Sierra Oil'],
    rejectedSubstitutions: ['Frozen Truffles'],
    orderHistory: [
      { id: 'o1', date: '2024-03-15', total: 4500, items: ['3x Alba Truffles', '12x EVOO', '24x Anchovies'] },
      { id: 'o2', date: '2024-04-01', total: 1200, items: ['10x Saffron', '5x Balsamic'] },
    ]
  },
  {
    id: 'b2',
    name: 'Marcus Thorne',
    company: 'The Capital Grille',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    email: 'm.thorne@darden.com',
    location: 'Chicago, IL',
    preferences: ['Bulk', 'Aged Meats', 'High-end Oils'],
    relationshipNotes: 'Only orders when price fluctuates. High turnover in kitchen, so stick to simple descriptions. Prefers text for urgent updates.',
    tone: 'Casual',
    signals: ['Price Sensitive', 'Recent Complaint'],
    engagementScore: 64,
    importantDates: [
      { label: 'Restaurant Anniversary', date: 'August 15' }
    ],
    acceptedSubstitutions: [],
    rejectedSubstitutions: ['Domestic Manchego'],
    orderHistory: [
      { id: 'o3', date: '2024-02-10', total: 8500, items: ['5x Iberico Legs', '10x Manchego Wheels', '20x Fleur de Sel'] },
    ]
  },
  // Generate 50 additional buyers with photos and varied data
  ...Array.from({ length: 50 }, (_, i) => {
    const firstNames = ['Julian', 'Sofia', 'Elena', 'Marco', 'Andre', 'Sasha', 'Victor', 'Amara', 'Leo', 'Maya'];
    const lastNames = ['Smith', 'Garcia', 'Lee', 'Chen', 'Rossi', 'Muller', 'Dupont', 'Kovacs', 'Tanaka', 'Silva'];
    const companies = ['Lumière', 'Terra', 'Ocean', 'Foundry', 'Saffron', 'Bistro', 'Gather', 'Harvest', 'Roots', 'Bloom'];
    const concepts = ['Kitchen', 'House', 'Table', 'Grill', 'Bistro', 'Atelier', 'Social', 'Lounge', 'Steakhouse', 'Eatery'];
    const locations = ['Miami, FL', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Denver, CO', 'Portland, OR', 'Atlanta, GA', 'San Diego, CA'];
    
    const name = `${firstNames[i % 10]} ${lastNames[(i + 5) % 10]}`;
    const gender = (i % 2 === 0) ? 'men' : 'women';
    
    return {
      id: `b${i + 3}`,
      name: name,
      company: `${companies[i % 10]} ${concepts[(i + 3) % 10]}`,
      email: `${name.toLowerCase().replace(' ', '.')}@${companies[i % 10].toLowerCase()}.com`,
      location: locations[i % locations.length],
      avatar: `https://randomuser.me/api/portraits/${gender}/${(i + 10) % 99}.jpg`,
      preferences: i % 3 === 0 ? ['Organic', 'Farm-to-Table'] : ['Imported', 'Bulk Pricing', 'Consistency'],
      signals: (i % 7 === 0 ? ['Low Engagement'] : i % 5 === 0 ? ['Seasonal'] : ['Frequent']) as BuyerSignal[],
      engagementScore: 40 + (i % 50),
      orderHistory: i % 5 === 0 ? [
        { id: `oh${i}`, date: '2024-03-20', total: 2400, items: ['12x Balsamic', '5x Manchego'] }
      ] : []
    };
  })
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    buyerId: 'b1',
    content: "Wait, Alex, I just realized we might need more truffles. Our guest count just jumped by 40. Can you check if we can double the allocation? Also, any word on those dried porcinis?",
    timestamp: '2 hours ago',
    type: 'inbound',
    aiDraft: {
      content: "Hi Sarah, checking the cellar now. We can definitely double the truffle allocation to 1kg—I've pulled from our reserve for you. For the porcinis, a new batch just cleared customs this morning. I've added a 2kg case of the dried selection to the draft below. Should I update the master Tuesday delivery with these additions?",
      skus: [MOCK_SKUS[0], MOCK_SKUS[1], MOCK_SKUS[6]],
      suggestedSubs: [],
      fitScore: 'High Fit',
      fitReason: 'Direct request for high-value items with urgency.',
      relationshipContext: "Sarah prefers direct, data-rich updates. She has a high guest count event and needs confirmation on stock doubling. Porcinis are a frequent secondary purchase for her gala menus.",
      recommendations: [
        { id: 'rec-truffle', productId: '1', suggestedQty: 1, reason: 'Doubling allocation per request.' },
        { id: 'rec-porcini', productId: '10', suggestedQty: 1, reason: 'New stock arrival matching your porcini query.' }
      ]
    }
  },
  {
    id: 'm2',
    buyerId: 'b2',
    content: "Let's do the Serrano for now. But for my regular inventory, do you have any deals on bulk Manchego this month? We need about 10-15 wheels. And what's the latest on the Iberico?",
    timestamp: '4 hours ago',
    type: 'inbound',
    aiDraft: {
      content: "Hey Marcus, Serrano is scheduled for tomorrow. On the Manchego, we have a volume discount tier starting at 5 wheels—I've applied a 15% discount for the 15 wheels you're looking for. Good news on the Iberico: the shipment finally cleared and we can have it to you in your Monday delivery. I've added both to the replenishment draft below.",
      skus: [MOCK_SKUS[2], MOCK_SKUS[3], MOCK_SKUS[5]],
      suggestedSubs: [],
      fitScore: 'Good Fit',
      fitReason: 'Replenishing core stock with volume pricing.',
      relationshipContext: "Marcus is price-sensitive. Applying the maximum volume discount on Manchego addresses his primary trigger. Iberico resolution is the top priority for restoring trust after the delay.",
      recommendations: [
        { id: 'rec4', productId: '3', suggestedQty: 3, reason: 'Replenishing cleared Iberico stock.' },
        { id: 'rec5', productId: '4', suggestedQty: 15, reason: 'Applied 15% bulk discount tier.' }
      ]
    }
  }
];

// Seed some history that exists OUTSIDE the primary inbox array to prevent list duplicates
export const MESSAGE_HISTORY: Message[] = [
  {
    id: 'm1_h1',
    buyerId: 'b1',
    content: "Hi Alex, we're building out our spring gala menu and need a robust selection. Can we get quotes for Alba truffles, but also those new Cantabrian anchovies and a bulk case of the first-press EVOO?",
    timestamp: 'Yesterday, 10:00 AM',
    type: 'inbound'
  },
  {
    id: 'm1_h2',
    buyerId: 'b1',
    content: "Hi Sarah! It's great to hear about the gala. I've put together a comprehensive quote for you. We have the Grade A Alba Truffles arriving next week, and I've pre-allocated 500g for you. I've also included 2 cases of the Cantabrian Anchovies and a full 12-bottle case of the Castillo de Canena First Press EVOO.",
    timestamp: 'Yesterday, 11:30 AM',
    type: 'outbound'
  },
  {
    id: 'm1_h3',
    buyerId: 'b1',
    content: "Perfect, everything is locked in and ready for Tuesday delivery. Appreciate the bulk order help!",
    timestamp: 'Yesterday, 2:00 PM',
    type: 'inbound'
  },
  {
    id: 'm2_h1',
    buyerId: 'b2',
    content: "Alex, quick heads up that the Iberico shipment is delayed by 4 days due to customs. Really sorry about the short notice.",
    timestamp: 'Tuesday',
    type: 'outbound'
  },
  {
    id: 'm2_h2',
    buyerId: 'b2',
    content: "That's frustrating. We had a private event booked for Friday. Can you see if there's any domestic alternative we can sub in just in case?",
    timestamp: 'Tuesday',
    type: 'inbound'
  },
  {
    id: 'm2_h3',
    buyerId: 'b2',
    content: "I've checked the domestic stock, but honestly, for that event's profile, I'd suggest the Serrano Reserve we have in the local warehouse. It's closer in flavor and I can have it there by tomorrow morning at no extra shipping cost.",
    timestamp: 'Wednesday',
    type: 'outbound'
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c2',
    name: 'Holiday Charcuterie Selection',
    status: 'draft',
    targetBuyersCount: 52,
    description: 'Curated holiday boards featuring hand-carved Iberico ham, aged Manchego, and artisan pairings. Perfect for high-volume end-of-year service.',
    productImage: 'https://i.etsystatic.com/64328478/r/il/ab3c30/7935665010/il_1588xN.7935665010_b1u8.jpg',
    buyers: [
      {
        buyerId: 'b1',
        personalizedDraft: "Subject: Holiday Service: Curated Charcuterie Selections for Blue Hill Farm\n\nHi Sarah,\n\nAs you transition into the busy holiday season, I wanted to personally hand-pick a full suite of items for your holiday program that align with your focus on rare, high-quality varietals.\n\nI’ve put together a selection featuring our hand-carved Iberico Bellota Ham, the 12-month Aged Manchego wheels, and our premium Modena Gold Balsamic. These represent the absolute peak of this year's harvest and would make a stunning addition to your festive menus.\n\nI've set aside a projected allocation for your upcoming service calendar. Shall we confirm the quantities for these three items?\n\nBest,\nAlex",
        suggestedSKUs: [MOCK_SKUS[2], MOCK_SKUS[3], MOCK_SKUS[5]],
      },
      {
        buyerId: 'b2',
        personalizedDraft: "Subject: Seasonal Update: Iberico Selection for The Capital Grille\n\nMarcus,\n\nThe holiday rush is starting, and I want to ensure your kitchen is stocked with a full inventory of high-end charcuterie.\n\nI've reserved an allocation of our Iberico legs, a bulk wheel order of Manchego, and a case of our Piquillo peppers to round out your meat boards. These items pair beautifully and provide the premium experience your regulars at The Capital Grille expect.\n\nShould we lock in this multi-item delivery for your next shipment cycle?\n\nBest,\nAlex",
        suggestedSKUs: [MOCK_SKUS[2], MOCK_SKUS[3], MOCK_SKUS[8]],
      },
      // Generate the rest of the 52 campaign buyers
      ...Array.from({ length: 50 }, (_, i) => ({
        buyerId: `b${i + 3}`,
        personalizedDraft: `Subject: Holiday Inventory Update: Premium Charcuterie Selection\n\nHi ${MOCK_BUYERS[i + 3]?.name || 'there'},\n\nWe're preparing our holiday allocations for the upcoming season. Given your previous interest in premium imports, I've drafted a suggested order for ${MOCK_BUYERS[i + 3]?.company || 'your kitchen'} including our Iberico selection and aged cheeses.\n\nShall we secure your delivery window?\n\nBest,\nAlex`,
        suggestedSKUs: [MOCK_SKUS[2], MOCK_SKUS[3], MOCK_SKUS[5]]
      }))
    ]
  },
  {
    id: 'c3',
    name: 'First Press EVOO: Spring Harvest',
    status: 'finished',
    targetBuyersCount: 18,
    description: 'Vibrant, peppery, and incredibly fresh. Our first press olive oils from Jaén are the heartbeat of the spring harvest.',
    productImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    buyers: [
      {
        buyerId: 'b1',
        personalizedDraft: "Subject: Just Arrived: Spring Pantry Replenishment\n\nSarah,\n\nThe new Castillo de Canena EVOO just arrived from Spain, and I've paired it with a few other spring essentials for Blue Hill Farm.\n\nI've reserved a case of the first press EVOO, a selection of Greek Red Saffron, and the first allotment of our fresh Alba truffles. These items are the backbone of spring seasonal cooking and will provide that fresh, intense flavor profile you look for.\n\nI've got this mixed order ready to stage. Let me know if you'd like to adjust the mix before we ship!\n\nCheers,\nAlex",
        suggestedSKUs: [MOCK_SKUS[1], MOCK_SKUS[7], MOCK_SKUS[0]],
      },
      {
        buyerId: 'b2',
        personalizedDraft: "Subject: Kitchen Update: Spring Harvest Allocation\n\nMarcus,\n\nThe Jaén harvest is in, and I've bundled it with our latest Piquillo peppers and Pine Nut allotments for your spring service.\n\nThis first-press olive oil is the perfect finish for your grilled steaks, while the peppers and Mediterranean nuts provide that essential texture and acidity your kitchen team relies on. Ordering these as a seasonal bundle ensures consistent supply through the rush.\n\nShall I add this spring trio to your Tuesday delivery?\n\nBest,\nAlex",
        suggestedSKUs: [MOCK_SKUS[1], MOCK_SKUS[8], MOCK_SKUS[9]],
      }
    ]
  }
];
