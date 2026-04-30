/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Send, 
  Inbox, 
  PieChart, 
  Settings, 
  Search, 
  Sparkles, 
  ArrowRight,
  Calendar,
  History,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  Filter,
  Star,
  Tag,
  Leaf,
  Cake,
  Gift,
  X,
  ChevronRight,
  ShoppingBag,
  Heart,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Buyer, Message, Campaign, SKU, CampaignBuyer, BuyerSignal } from './types';
import { MOCK_MESSAGES, MESSAGE_HISTORY, MOCK_BUYERS, MOCK_CAMPAIGNS, MOCK_SKUS, USER_PROFILE } from './constants';

type View = 'inbox' | 'campaigns' | 'profiles' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [view, setView] = useState<View>('inbox');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(MOCK_MESSAGES[0].id);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedBuyerIdForProfile, setSelectedBuyerIdForProfile] = useState<string | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const activeMessage = useMemo(() => 
    messages.find(m => m.id === selectedMessageId), 
  [selectedMessageId, messages]);

  const activeCampaign = useMemo(() => 
    MOCK_CAMPAIGNS.find(c => c.id === selectedCampaignId),
  [selectedCampaignId]);

  const profileBuyerId = selectedBuyerIdForProfile || activeMessage?.buyerId;
  const profileBuyer = MOCK_BUYERS.find(b => b.id === profileBuyerId);

  if (!isAuthenticated) {
    return <LoginView onLogin={() => {
      setIsAuthenticated(true);
      setShowOnboarding(true);
    }} />;
  }

  return (
    <div className="relative flex h-screen bg-brand-bg font-sans overflow-hidden">
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingOverlay
            onComplete={() => setShowOnboarding(false)}
            setView={setView}
            onOpenProfile={() => {
              setSelectedBuyerIdForProfile(activeMessage?.buyerId || null);
              setShowProfile(true);
            }}
            onCloseProfile={() => setShowProfile(false)}
            onSetMobileDetail={setShowMobileDetail}
          />
        )}
      </AnimatePresence>
      {/* Sidebar navigation */}
      <aside className="hidden md:flex w-16 xl:w-56 border-r border-gray-200 flex-col p-2 xl:p-4 bg-gray-50/50">
        <div className="flex items-center justify-center xl:justify-start gap-2 px-1 xl:px-3 mb-6 xl:mb-8">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-xl font-display flex-shrink-0">
            F
          </div>
          <span className="hidden xl:block text-xl font-bold font-display tracking-tight">Foodie</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button
            id="nav-inbox"
            onClick={() => {
              setView('inbox');
              setSelectedMessageId(messages[0]?.id || null);
            }}
            className={`sidebar-link w-full justify-center xl:justify-start ${view === 'inbox' ? 'active' : ''}`}
            title="Buyers"
          >
            <Inbox size={20} />
            <span className="hidden xl:inline">Buyers</span>
          </button>
          <button
            id="nav-campaigns"
            onClick={() => {
              setView('campaigns');
              setSelectedCampaignId(null);
            }}
            className={`sidebar-link w-full justify-center xl:justify-start ${view === 'campaigns' ? 'active' : ''}`}
            title="Campaigns"
          >
            <PieChart size={20} />
            <span className="hidden xl:inline">Campaigns</span>
          </button>
          <button
            id="nav-profiles"
            onClick={() => setView('profiles')}
            className={`sidebar-link w-full justify-center xl:justify-start ${view === 'profiles' ? 'active' : ''}`}
            title="Profile"
          >
            <Users size={20} />
            <span className="hidden xl:inline">Profile</span>
          </button>
          <button
            onClick={() => setView('settings')}
            className={`sidebar-link w-full justify-center xl:justify-start ${view === 'settings' ? 'active' : ''}`}
            title="Settings"
          >
            <Settings size={20} />
            <span className="hidden xl:inline">Settings</span>
          </button>
        </nav>

        <div className="mt-auto">
          <div className="hidden xl:flex items-center justify-between p-3 glass-panel bg-white/40">
            <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
              <img
                src={USER_PROFILE.avatar}
                alt={USER_PROFILE.name}
                className="w-8 h-8 rounded-full object-cover border border-white shadow-sm flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{USER_PROFILE.name}</p>
                <p className="text-[10px] text-gray-500 font-medium truncate">{USER_PROFILE.role}</p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
          <div className="xl:hidden flex justify-center p-1">
            <img
              src={USER_PROFILE.avatar}
              alt={USER_PROFILE.name}
              className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'inbox' && (
            <motion.div 
              key="inbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex overflow-hidden"
              id="message-view"
            >
              <div className={`${showMobileDetail ? 'hidden md:block' : 'block'} md:block w-full md:w-auto shrink-0`}>
                <InboxListView
                  id="message-list"
                  messages={messages}
                  selectedId={selectedMessageId}
                  onSelect={(id) => {
                    setSelectedMessageId(id);
                    setView('inbox');
                    setShowMobileDetail(true);
                  }}
                  onToggleProfile={(id) => {
                     setSelectedBuyerIdForProfile(id);
                     setShowProfile(true);
                  }}
                />
              </div>
              <div className={`${showMobileDetail ? 'flex' : 'hidden md:flex'} flex-1 min-w-0 overflow-hidden`}>
                <MessageDetailView
                  message={activeMessage}
                  setView={setView}
                  showProfile={showProfile}
                  onToggleProfile={() => {
                    setSelectedBuyerIdForProfile(activeMessage?.buyerId || null);
                    setShowProfile(!showProfile);
                  }}
                  onMessageSent={(id, finalContent) => {
                    setMessages(prev => prev.map(m => m.id === id ? {
                      ...m,
                      type: 'outbound' as const,
                      content: finalContent,
                      aiDraft: undefined
                    } : m));
                    setSelectedMessageId(null);
                  }}
                  onBack={() => setShowMobileDetail(false)}
                />
              </div>
            </motion.div>
          )}

          {view === 'campaigns' && (
            <motion.div 
              key="campaigns"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {!selectedCampaignId ? (
                <CampaignListView 
                  campaigns={MOCK_CAMPAIGNS} 
                  onSelect={setSelectedCampaignId} 
                />
              ) : (
                <CampaignDetailView 
                  campaign={activeCampaign} 
                  onBack={() => setSelectedCampaignId(null)} 
                  onToggleProfile={(id) => {
                    setSelectedBuyerIdForProfile(id);
                    setShowProfile(true);
                  }}
                />
              )}
            </motion.div>
          )}

          {view === 'profiles' && (
            <motion.div 
              key="profiles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col p-4 xl:p-8 overflow-y-auto pb-20 md:pb-8"
            >
              <div className="max-w-4xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 xl:gap-6 mb-6 xl:mb-12 text-center sm:text-left">
                  <img
                    src={USER_PROFILE.avatar}
                    alt={USER_PROFILE.name}
                    className="w-16 h-16 xl:w-24 xl:h-24 rounded-2xl object-cover shadow-sm border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h1 className="text-2xl xl:text-4xl font-bold font-display mb-1">{USER_PROFILE.name}</h1>
                    <p className="text-gray-500 font-medium">Senior {USER_PROFILE.role} &bull; Specialty Foods Division</p>
                    <div className="flex gap-4 mt-4">
                      <div className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-600 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Online
                      </div>
                      <div className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-600 shadow-sm">
                        New York Office
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="glass-panel p-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Portfolio Size</p>
                    <p className="text-3xl font-bold">52</p>
                  </div>
                  <div className="glass-panel p-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Draft Campaigns</p>
                    <p className="text-3xl font-bold">{MOCK_CAMPAIGNS.filter(c => c.status === 'draft').length} <span className="text-sm font-normal text-gray-400">in review</span></p>
                  </div>
                  <div className="glass-panel p-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Portfolio Value</p>
                    <p className="text-3xl font-bold text-brand-orange">$1.2M</p>
                  </div>
                </div>

                <div className="space-y-6">
                   <h2 className="text-xl font-bold font-display">Pending Outreach</h2>
                   <div className="grid grid-cols-1 gap-4">
                      <div className="glass-panel p-6 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-bg rounded-lg text-brand-orange"><Inbox size={24} /></div>
                            <div>
                               <p className="font-bold">Holiday Charcuterie Bundle</p>
                               <p className="text-sm text-gray-500">Drafting outreach for 52 accounts.</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => {
                             setView('campaigns');
                             setSelectedCampaignId('c2');
                           }}
                           className="text-brand-orange font-bold text-sm hover:underline"
                         >
                           View Details
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col p-4 xl:p-8 overflow-y-auto pb-20 md:pb-8"
            >
              <SettingsView onLogout={() => setIsAuthenticated(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2 shadow-lg">
        <button
          id="mob-nav-inbox"
          onClick={() => { setView('inbox'); setShowMobileDetail(false); }}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${view === 'inbox' ? 'text-brand-orange' : 'text-gray-400'}`}
        >
          <Inbox size={22} />
          <span className="text-[10px] font-bold">Buyers</span>
        </button>
        <button
          id="mob-nav-campaigns"
          onClick={() => { setView('campaigns'); setSelectedCampaignId(null); }}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${view === 'campaigns' ? 'text-brand-orange' : 'text-gray-400'}`}
        >
          <PieChart size={22} />
          <span className="text-[10px] font-bold">Campaigns</span>
        </button>
        <button
          id="mob-nav-profiles"
          onClick={() => setView('profiles')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${view === 'profiles' ? 'text-brand-orange' : 'text-gray-400'}`}
        >
          <Users size={22} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
        <button
          onClick={() => setView('settings')}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${view === 'settings' ? 'text-brand-orange' : 'text-gray-400'}`}
        >
          <Settings size={22} />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>

      {/* Slide-out Profile Sidebar */}
      <AnimatePresence>
        {showProfile && profileBuyer && (
          <BuyerProfileSidebar
            buyer={profileBuyer}
            onClose={() => {
              setShowProfile(false);
              setSelectedBuyerIdForProfile(null);
            }}
            elevated={showOnboarding}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * HELPER COMPONENTS
 */

function SignalIcon({ signal, size = 14 }: { signal: BuyerSignal, size?: number, key?: React.Key }) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (signal) {
      case 'VIP': return <Star size={size} className="text-yellow-500 fill-yellow-500" />;
      case 'Low Engagement': return <TrendingDown size={size} className="text-red-500" />;
      case 'Price Sensitive': return <Tag size={size} className="text-blue-500" />;
      case 'Seasonal': return <Leaf size={size} className="text-green-500" />;
      case 'Frequent': return <RefreshCw size={size} className="text-purple-500" />;
      case 'Birthday': return <Cake size={size} className="text-pink-500" />;
      case 'Anniversary': return <Gift size={size} className="text-orange-500" />;
      case 'Recent Complaint': return <AlertCircle size={size} className="text-red-600" />;
      default: return null;
    }
  };

  const labels: Record<string, string> = {
    'VIP': 'VIP Buyer',
    'Low Engagement': 'Low Engagement',
    'Price Sensitive': 'Price Sensitive',
    'Seasonal': 'Seasonal Buyer',
    'Frequent': 'Frequent Reorder',
    'Birthday': 'Birthday',
    'Anniversary': 'Restaurant Anniversary',
    'Recent Complaint': 'Recent Complaint'
  };

  return (
    <div 
      className="relative flex items-center justify-center cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getIcon()}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900/95 text-white text-[10px] font-bold rounded shadow-xl whitespace-nowrap z-[100] pointer-events-none backdrop-blur-sm border border-white/10"
          >
            {labels[signal] || signal}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EngagementBar({ score }: { score: number }) {
  const getColor = () => {
    if (score > 80) return 'bg-green-500';
    if (score > 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${getColor()} transition-all`} 
        style={{ width: `${score}%` }} 
      />
    </div>
  );
}

function BuyerProfileSidebar({ buyer: initialBuyer, onClose, elevated = false }: { buyer: Buyer, onClose: () => void, elevated?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [buyer, setBuyer] = useState(initialBuyer);

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would update the backend/global state
  };

  return (
    <motion.aside 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className={`absolute right-0 top-0 bottom-0 w-full md:w-64 xl:w-80 border-l border-gray-200 bg-white flex flex-col overflow-hidden shadow-2xl ${elevated ? 'z-[110]' : 'z-40'}`}
    >
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold font-display text-gray-900">Buyer Profile</h3>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1 px-3 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Edit2 size={12} /> Edit
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="p-1 px-3 bg-brand-orange text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm"
            >
              Save Changes
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2" title="Close"><X size={18} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Basic Info */}
        <div className="text-center">
          <img 
            src={buyer.avatar} 
            alt={buyer.name} 
            className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover shadow-sm border border-gray-100"
            referrerPolicy="no-referrer"
          />
          <h4 className="text-lg font-bold text-gray-900">{buyer.name}</h4>
          <p className="text-sm text-gray-500">{buyer.company}</p>
        </div>

        {/* Tone & Notes */}
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-brand-blue/30 shadow-sm">
            <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles size={10} /> AI Drafting Tone
            </p>
            {isEditing ? (
              <div className="space-y-2">
                <select 
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-medium focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
                  value={buyer.tone}
                  onChange={(e) => setBuyer({ ...buyer, tone: e.target.value as any })}
                >
                  <option value="Direct">Direct</option>
                  <option value="Casual">Casual</option>
                  <option value="Professional">Professional</option>
                  <option value="Formal">Formal</option>
                </select>
                <p className="text-[9px] text-gray-400 leading-tight">
                  This setting tells the AI how to voice future drafts for this specific buyer.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-gray-700">{buyer.tone || 'Direct'}</p>
                <p className="text-[9px] text-gray-400 mt-1 italic">AI will prioritize this tone in future harvests.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relationship Notes</p>
            {isEditing ? (
              <textarea 
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs leading-relaxed min-h-[100px] focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
                value={buyer.relationshipNotes}
                onChange={(e) => setBuyer({ ...buyer, relationshipNotes: e.target.value })}
                placeholder="Add special notes about delivery, preferences, or personal details..."
              />
            ) : (
              <p className="text-xs text-gray-500 leading-relaxed italic border-l-2 border-brand-orange/20 pl-3">
                "{buyer.relationshipNotes || 'No notes yet.'}"
              </p>
            )}
          </div>
        </div>

        {/* Split Section: Engagement & Signals */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Engagement Score</span>
              <span className="text-gray-900">{buyer.engagementScore}%</span>
            </div>
            <EngagementBar score={buyer.engagementScore} />
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Context Signals</p>
            <div className="flex flex-wrap gap-2">
              {buyer.signals.map(s => (
                <div key={s} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded flex items-center gap-1.5 text-[10px] font-bold text-gray-600">
                  <SignalIcon signal={s} size={12} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Preferences</p>
          <div className="flex flex-wrap gap-1.5">
            {buyer.preferences.map(p => (
              <span key={p} className="px-2 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-medium text-gray-500">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Substitutions */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Substitutions History</p>
          <div className="space-y-2">
            {buyer.acceptedSubstitutions?.map(s => (
              <div key={s} className="flex items-center gap-2 text-xs text-green-600 font-medium">
                <CheckCircle2 size={12} /> Accepted: {s}
              </div>
            ))}
            {buyer.rejectedSubstitutions?.map(s => (
              <div key={s} className="flex items-center gap-2 text-xs text-red-600 font-medium">
                <AlertCircle size={12} /> Rejected: {s}
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Orders</p>
          <div className="space-y-3">
            {buyer.orderHistory.slice(0, 3).map(order => (
              <div key={order.id} className="p-3 bg-gray-50 rounded-lg text-xs">
                <div className="flex justify-between font-bold mb-1">
                  <span>{order.date}</span>
                  <span className="text-brand-orange">${order.total.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 truncate">{order.items.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

/** 
 * SETTINGS COMPONENTS
 */
function SettingsView({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'ai'>('profile');

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-6 xl:mb-8">
        <h1 className="text-2xl xl:text-3xl font-bold font-display mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and system configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 xl:gap-8">
        {/* Navigation Tabs */}
        <div className="shrink-0 md:w-36 xl:w-48">
          <div className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`shrink-0 text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:bg-white hover:text-brand-orange'}`}
          >
            Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`shrink-0 text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:bg-white hover:text-brand-orange'}`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`shrink-0 text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:bg-white hover:text-brand-orange'}`}
          >
            AI Agent Config
          </button>
          </div>

          <div className="hidden md:block pt-8 border-t border-gray-100 mt-8">
            <button
              onClick={() => onLogout()}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <Trash2 size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div 
                key="profile-settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="glass-panel p-6">
                  <h3 className="text-lg font-bold font-display mb-6">Profile Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative group">
                        <img 
                          src={USER_PROFILE.avatar} 
                          alt={USER_PROFILE.name} 
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Edit2 size={20} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{USER_PROFILE.name}</p>
                        <p className="text-sm text-gray-500">JPG or PNG. Max size 2MB.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input type="text" defaultValue={USER_PROFILE.name} className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        <input type="email" defaultValue="alex.rossi@foodie.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Role</label>
                      <input type="text" defaultValue={USER_PROFILE.role} className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm" />
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6">
                   <h3 className="text-lg font-bold font-display mb-4">Security</h3>
                   <button className="text-sm text-brand-orange font-bold hover:underline">Change Account Password</button>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">Save Profile Changes</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div 
                key="notification-settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="glass-panel p-6">
                  <h3 className="text-lg font-bold font-display mb-6">Inbound Alerts</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Desktop Notifications</p>
                        <p className="text-xs text-gray-500">Show floating alerts when a new message arrives.</p>
                      </div>
                      <div className="h-6 w-11 bg-orange-500 rounded-full relative cursor-pointer shadow-inner">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Email Digests</p>
                        <p className="text-xs text-gray-500">Daily summary of unread inquiries and campaign stats.</p>
                      </div>
                      <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <h3 className="text-lg font-bold font-display mb-6">Campaign Status</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Launch Confirmations</p>
                        <p className="text-xs text-gray-500">Notify me when a campaign has finished sending.</p>
                      </div>
                      <div className="h-6 w-11 bg-orange-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div 
                key="ai-settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="glass-panel p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-brand-orange" size={20} />
                    <h3 className="text-lg font-bold font-display">AI Drafting Personality</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-gray-100 rounded-xl text-left hover:border-brand-orange transition-all">
                      <p className="font-bold text-sm mb-1">Conservative</p>
                      <p className="text-[10px] text-gray-500">Fact-focused, brief, and professional.</p>
                    </button>
                    <button className="p-4 border-2 border-brand-orange/40 bg-brand-orange/5 rounded-xl text-left">
                      <p className="font-bold text-sm mb-1">Consultative</p>
                      <p className="text-[10px] text-gray-500 italic">Warm, helpful, and suggests pairings.</p>
                    </button>
                    <button className="p-4 border-2 border-gray-100 rounded-xl text-left hover:border-brand-orange transition-all">
                      <p className="font-bold text-sm mb-1">Growth</p>
                      <p className="text-[10px] text-gray-500">Upsell oriented and enthusiastic.</p>
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <h3 className="text-lg font-bold font-display mb-6">System Controls</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Smart SKU Suggestions</p>
                        <p className="text-xs text-gray-500">Automatically identify cross-sell items in drafts.</p>
                      </div>
                      <div className="h-6 w-11 bg-orange-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Historical Data Grounding</p>
                        <p className="text-xs text-gray-500">Use past order history to personalize AI drafts.</p>
                      </div>
                      <div className="h-6 w-11 bg-orange-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** 
 * INBOX COMPONENTS 
 */

function InboxListView({ messages, selectedId, onSelect, onToggleProfile, id }: { 
  messages: Message[], 
  selectedId: string | null, 
  onSelect: (id: string) => void,
  onToggleProfile: (id: string) => void,
  id?: string
}) {
  const [filter, setFilter] = useState<'inbound' | 'outbound'>('inbound');

  const filteredMessages = useMemo(() => 
    messages.filter(m => m.type === filter),
  [messages, filter]);

  return (
    <div id={id} className="w-full md:w-56 xl:w-72 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-100 space-y-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setFilter('inbound')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'inbound' ? 'bg-white shadow-sm text-brand-orange' : 'text-gray-500'}`}
          >
            Inbox
          </button>
          <button 
            onClick={() => setFilter('outbound')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'outbound' ? 'bg-white shadow-sm text-brand-orange' : 'text-gray-500'}`}
          >
            Sent
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder={`Search ${filter === 'inbound' ? 'inquiries' : 'sent messages'}...`} 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-brand-orange"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No messages found</div>
        ) : (
          filteredMessages.map((msg, index) => {
            const buyer = MOCK_BUYERS.find(b => b.id === msg.buyerId);
            return (
              <div
                key={msg.id}
                id={index === 0 ? "onboarding-message" : undefined}
                onClick={() => onSelect(msg.id)}
                className={`w-full p-4 border-b border-gray-50 text-left hover:bg-gray-50 transition-colors relative cursor-pointer ${selectedId === msg.id ? 'bg-brand-bg/50' : ''}`}
              >
                {selectedId === msg.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
                )}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(msg.id);
                      if (buyer?.id) onToggleProfile(buyer.id);
                    }}
                    className="relative group cursor-pointer"
                  >
                    {buyer?.avatar ? (
                      <img 
                        src={buyer.avatar} 
                        alt={buyer.name} 
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-transparent group-hover:border-brand-orange transition-all"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs flex-shrink-0 border-2 border-transparent group-hover:border-brand-orange transition-all">
                        {buyer?.name.charAt(0)}
                      </div>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm truncate">{buyer?.company}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-medium">{msg.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-gray-800">{buyer?.name}</p>
                      <div className="flex gap-1">
                        {buyer?.signals.slice(0, 2).map((s, idx) => (
                          <SignalIcon key={idx} signal={s} size={10} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function MessageDetailView({
  message: initialMessage,
  setView,
  showProfile,
  onToggleProfile,
  onMessageSent,
  onBack
}: {
  message: Message | undefined;
  setView: (view: View) => void;
  showProfile: boolean;
  onToggleProfile: () => void;
  onMessageSent: (id: string, content: string) => void;
  onBack?: () => void;
}) {
  const [message, setMessage] = useState<Message | undefined>(initialMessage);
  const [autosaveStatus, setAutosaveStatus] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  // Update local state when prop changes
  React.useEffect(() => {
    setMessage(initialMessage);
    setIsSent(false); // Reset sent state when switching messages
  }, [initialMessage]);

  if (!message) return (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      Select a message to view details
    </div>
  );

  const buyer = MOCK_BUYERS.find(b => b.id === message.buyerId);
  
  // Find all messages for this buyer and exclude the "current" active message to render it separately at bottom
  const allMessages = [...MESSAGE_HISTORY, ...MOCK_MESSAGES];
  const history = allMessages.filter(m => 
    m.buyerId === message.buyerId && m.id !== message.id
  );

  const triggerAutosave = () => {
    setAutosaveStatus('Saving...');
    setTimeout(() => setAutosaveStatus('Draft saved'), 1000);
    setTimeout(() => setAutosaveStatus(null), 3000);
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="p-4 xl:p-6 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center gap-3 xl:gap-4 min-w-0">
            <button
              onClick={onBack}
              className="md:hidden p-2 mr-1 hover:bg-gray-100 rounded-lg text-gray-500 shrink-0"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>
            <button
              id="buyer-profile-toggle"
              onClick={onToggleProfile}
              className="relative group cursor-pointer shrink-0"
              title="Toggle Buyer Profile"
            >
              {buyer?.avatar ? (
                <img 
                  src={buyer.avatar} 
                  alt={buyer.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-brand-orange transition-all"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg border-2 border-transparent group-hover:border-brand-orange transition-all">
                  {buyer?.name.charAt(0)}
                </div>
              )}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base xl:text-xl font-bold font-display truncate">{buyer?.company}</h2>
                <div className="flex gap-1">
                  {buyer?.signals.map((s, idx) => (
                    <SignalIcon key={idx} signal={s} size={14} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">{buyer?.name} &bull; {buyer?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {autosaveStatus && (
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <RefreshCw size={10} className="animate-spin" /> {autosaveStatus}
              </span>
            )}
            <button 
              onClick={onToggleProfile}
              className={`p-2 rounded-lg transition-colors ${showProfile ? 'bg-brand-orange/10 text-brand-orange' : 'hover:bg-gray-50 text-gray-400'}`}
              title="Toggle Buyer Profile"
            >
              <Users size={20} />
            </button>
          </div>
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-y-auto p-4 xl:p-8 bg-gray-50/10">
          <div className="max-w-3xl mx-auto space-y-12 pb-36 md:pb-20">
            <AnimatePresence>
              {feedbackMessage && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="fixed bottom-8 right-8 z-50 bg-gray-900/90 text-white px-3 py-2 rounded-xl text-[10px] font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md border border-white/10"
                >
                  <Sparkles size={12} className="text-brand-orange" />
                  {feedbackMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Render Historical Messages */}
            <div className="space-y-8">
              {history.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.type === 'outbound' ? 'flex-row-reverse' : ''}`}>
                  {msg.type === 'inbound' ? (
                    buyer?.avatar ? (
                      <img src={buyer.avatar} alt={buyer.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">{buyer?.name.charAt(0)}</div>
                    )
                  ) : (
                    <img src={USER_PROFILE.avatar} alt={USER_PROFILE.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                  )}
                  <div className={`space-y-1.5 max-w-[80%] ${msg.type === 'outbound' ? 'text-right' : ''}`}>
                    <div className={`p-4 rounded-2xl shadow-sm border text-sm leading-relaxed ${
                      msg.type === 'outbound' 
                        ? 'bg-gray-800 text-white border-gray-800 rounded-tr-none' 
                        : 'bg-white border-gray-100 rounded-tl-none text-gray-700'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold px-2 uppercase tracking-wide">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider for Current Action */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center"><span className="bg-gray-50/10 px-4 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Newest Message</span></div>
            </div>

            {/* Current Active Inquiry */}
            <div className={`flex gap-4 ${message.type === 'outbound' ? 'flex-row-reverse' : ''}`}>
              {message.type === 'inbound' ? (
                buyer?.avatar ? (
                  <img src={buyer.avatar} alt={buyer.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">{buyer?.name.charAt(0)}</div>
                )
              ) : (
                <img src={USER_PROFILE.avatar} alt={USER_PROFILE.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
              )}
              <div className={`space-y-1.5 max-w-[80%] ${message.type === 'outbound' ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-2xl shadow-sm border text-sm leading-relaxed ${
                  message.type === 'outbound' 
                    ? 'bg-brand-orange text-white border-brand-orange rounded-tr-none' 
                    : 'bg-white border-gray-200 rounded-tl-none text-gray-900 font-medium'
                }`}>
                  {message.content}
                </div>
                <span className="text-[10px] text-gray-400 font-semibold px-2 uppercase tracking-wide">
                   Received at {message.timestamp}
                </span>
              </div>
            </div>

            {/* Outbound Success State */}
            {isSent && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold font-display">Outreach Sent</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Response delivered to {buyer?.name}. Future drafts will incorporate these style preferences.
                </p>
                <button 
                  onClick={() => {
                    if (message) onMessageSent(message.id, message.aiDraft?.content || "");
                  }}
                  className="text-brand-orange font-bold text-sm hover:underline"
                >
                  Back to List
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* AI Suggestion Area (Draft Editor) - NOW STICKY AT BOTTOM */}
        {message.type === 'inbound' && message.aiDraft && !isSent && (
          <div className="px-4 xl:px-8 pb-20 md:pb-4 xl:pb-8 z-20">
            <div id="ai-draft-area" className="w-full max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50"
            >
              <div className="bg-white px-4 xl:px-8 py-3 xl:py-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-brand-orange" fill="currentColor" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">AI Draft Response</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  message.aiDraft.fitScore === 'High Fit' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {message.aiDraft.fitScore}
                </div>
              </div>

              <div className="bg-brand-bg/50 px-4 xl:px-8 py-3 xl:py-4 border-b border-gray-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg border border-brand-blue/20 text-brand-orange">
                  <Heart size={16} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relationship Context</p>
                    <span className="text-[8px] bg-brand-blue/20 text-brand-blue px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">AI Memory Sync</span>
                  </div>
                  <textarea 
                    className="w-full bg-transparent border-none p-0 text-xs text-gray-700 leading-relaxed font-semibold focus:ring-0 resize-none min-h-[40px]"
                    value={message.aiDraft.relationshipContext || ""}
                    onChange={(e) => {
                       if (!message.aiDraft) return;
                       setMessage({
                         ...message,
                         aiDraft: { ...message.aiDraft, relationshipContext: e.target.value }
                       });
                    }}
                    placeholder="Add specific relationship details to refine this and future AI drafts..."
                    onBlur={() => showFeedback("AI learning: Updated relationship context for future refinement.")}
                  />
                </div>
              </div>
              
              <div className="p-4 xl:p-8">
                <textarea
                  className="w-full min-h-[100px] xl:min-h-[120px] p-0 border-none focus:ring-0 text-gray-700 leading-relaxed text-sm xl:text-base resize-none"
                  value={message.aiDraft.content}
                  onChange={(e) => {
                    if (!message.aiDraft) return;
                    setMessage({
                      ...message,
                      aiDraft: { ...message.aiDraft, content: e.target.value }
                    });
                    triggerAutosave();
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== initialMessage?.aiDraft?.content) {
                      showFeedback("AI learning: Tracking tone adjustments for future refinement.");
                    }
                  }}
                  placeholder="Write your message here..."
                />
              </div>
              
              <div className="bg-gray-50/80 px-4 xl:px-8 py-3 xl:py-4 flex justify-end items-center border-t border-gray-100">
                 <div className="flex gap-4 items-center">
                    <button className="px-6 h-10 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                      Discard
                    </button>
                    <button 
                      onClick={() => setIsSent(true)}
                      className="px-6 h-10 rounded-xl bg-brand-orange text-white font-bold flex items-center gap-3 hover:bg-brand-orange/90 transition-all shadow-lg shadow-brand-orange/20"
                    >
                      <Send size={18} /> Send Message
                    </button>
                 </div>
              </div>
            </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * CAMPAIGN COMPONENTS
 */

function CampaignListView({ campaigns, onSelect }: { campaigns: Campaign[], onSelect: (id: string) => void }) {
  return (
    <div className="p-4 xl:p-8 pb-20 md:pb-8 overflow-y-auto">
      <div className="flex justify-between items-end mb-4 xl:mb-8">
        <div>
          <h1 className="text-2xl xl:text-3xl font-bold font-display mb-2">Seasonal Campaigns</h1>
          <p className="text-gray-500">Run outbound personalized outreach for seasonal harvests.</p>
        </div>
        <button className="btn-primary">+ New Campaign</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <div 
            key={campaign.id} 
            onClick={() => onSelect(campaign.id)}
            className="glass-panel overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group border-none bg-white"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={campaign.productImage} 
                alt={campaign.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                  campaign.status === 'draft' ? 'bg-white text-gray-700' : 
                  'bg-gray-800 text-white'
                }`}>
                  {campaign.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-orange transition-colors font-display tracking-tight">
                {campaign.name}
              </h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                {campaign.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignDetailView({ campaign: initialCampaign, onBack, onToggleProfile }: { 
  campaign: Campaign | undefined, 
  onBack: () => void,
  onToggleProfile: (id: string) => void 
}) {
  const [campaign, setCampaign] = useState<Campaign | undefined>(initialCampaign);
  const [editingBuyerId, setEditingBuyerId] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);

  if (!campaign) return null;

  const filteredBuyers = campaign.buyers;

  const isEditable = campaign.status === 'draft';

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setHasLaunched(true);
    }, 2000);
  };

  const updateDraft = (buyerId: string, newDraft: string) => {
    setCampaign(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        buyers: prev.buyers.map(b => b.buyerId === buyerId ? { ...b, personalizedDraft: newDraft } : b)
      };
    });
  };

  if (hasLaunched) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <Send size={40} />
        </motion.div>
        <h2 className="text-3xl font-bold font-display mb-2">Campaign Launched!</h2>
        <p className="text-gray-500 mb-8 max-w-md">Your personalized outreach has been sent to {campaign.targetBuyersCount} buyers. You can track engagement in the Messages tab.</p>
        <button onClick={onBack} className="btn-primary">Return to Campaigns</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="p-4 xl:p-6 border-b border-gray-100 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-3 xl:gap-4 min-w-0">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 shrink-0">
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <div className="flex items-center gap-3 xl:gap-4 min-w-0">
             <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                <img src={campaign.productImage} className="w-full h-full object-cover" />
             </div>
             <div className="min-w-0">
               <h2 className="text-lg xl:text-2xl font-bold font-display truncate">{campaign.name}</h2>
               <p className="text-sm text-gray-500 truncate max-w-md">
                 {campaign.description}
               </p>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
          {isEditable && (
             <div className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                Draft
             </div>
          )}
          {isEditable && (
            <>
              <button className="btn-secondary" disabled={isLaunching}>Save as Draft</button>
              <button 
                onClick={handleLaunch}
                disabled={isLaunching}
                className="bg-[#f16e36] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 uppercase tracking-wide text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isLaunching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>Send Outreach To Selected</>
                )}
              </button>
            </>
          )}
          {!isEditable && (
             <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-500 text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                Finished
             </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main List of Targeted Buyers */}
        <div className="flex-1 overflow-y-auto p-4 xl:p-8 pb-20 md:pb-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6 xl:mb-12">
              <div>
                 <h3 className="font-bold text-xl xl:text-2xl font-display">
                   Campaign Outreach
                 </h3>
                 <p className="text-xs xl:text-sm text-gray-500 mt-1">Personalize and review messages before launching the harvest campaign.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 shadow-sm flex items-center gap-2 hover:bg-gray-50">
                   <Filter size={14} /> Bulk Adjust
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredBuyers.map((cb, idx) => {
                const buyer = MOCK_BUYERS.find(b => b.id === cb.buyerId);
                const isEditing = editingBuyerId === cb.buyerId;

                return (
                  <div key={idx} className={`glass-panel overflow-hidden transition-all bg-white border border-gray-100 ${isEditing ? 'border-brand-orange shadow-lg' : 'hover:border-brand-orange/40'}`}>
                    <div className="p-6">
                       {/* Top Row: Basic Info and Metas */}
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange" />
                             <button
                               onClick={() => buyer?.id && onToggleProfile(buyer.id)}
                               className="relative group cursor-pointer"
                               title="View Buyer Profile"
                             >
                               {buyer?.avatar ? (
                                  <img src={buyer.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-brand-orange transition-all" />
                               ) : (
                                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-brand-orange font-bold font-display border-2 border-transparent group-hover:border-brand-orange transition-all">{buyer?.name.charAt(0)}</div>
                               )}
                             </button>
                             <div>
                                <div className="flex items-center gap-1.5">
                                   <p className="font-bold text-gray-900">{buyer?.name}</p>
                                   <div className="flex gap-0.5">
                                      {buyer?.signals.map((s, i) => (
                                         <SignalIcon key={i} signal={s} size={10} />
                                      ))}
                                   </div>
                                </div>
                                <p className="text-xs text-gray-500">{buyer?.company} &bull; {buyer?.location}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                             <div className="flex gap-1">
                                <button onClick={() => setEditingBuyerId(isEditing ? null : cb.buyerId)} className={`p-2 rounded-lg transition-all ${isEditing ? 'bg-brand-orange text-white' : 'hover:bg-gray-50 text-gray-400'}`}>
                                   <Edit2 size={16} />
                                </button>
                                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                             </div>
                          </div>
                       </div>

                       {/* Recommendation Content removed per user request */}


                       {/* Personalized Draft Editor Section */}
                       <AnimatePresence>
                          {isEditing && (
                             <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="overflow-hidden mt-6 pt-6 border-t border-gray-100"
                             >
                                <div className="space-y-6">
                                   <div className="bg-brand-bg/50 p-4 rounded-xl border border-brand-blue/10 flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-4">
                                         <div className="p-2 bg-white rounded-lg text-brand-orange shadow-sm"><Heart size={14} /></div>
                                         <div className="flex-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Relationship Context</p>
                                            <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                              {buyer?.tone} communicator. {buyer?.relationshipNotes}
                                            </p>
                                         </div>
                                      </div>
                                   </div>
                                   <div className="space-y-4">
                                   <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 bg-brand-orange rounded-full" />
                                         <span className="text-xs font-bold text-gray-700 font-display uppercase tracking-wider">Email Campaign Draft</span>
                                      </div>
                                      <span className="text-[10px] text-gray-400 font-medium italic">Autosaving Changes...</span>
                                   </div>
                                   <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                                         <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                         </div>
                                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={10} /> Dynamic personalization active
                                         </div>
                                      </div>
                                      <textarea 
                                        className="w-full min-h-[300px] p-6 bg-white border-none focus:ring-0 text-sm text-gray-700 leading-relaxed font-sans subpixel-antialiased"
                                        value={cb.personalizedDraft}
                                        onChange={(e) => updateDraft(cb.buyerId, e.target.value)}
                                        placeholder="Craft your polished outreach here..."
                                      />
                                    </div>
                                   <div className="flex justify-between items-center bg-brand-bg/30 p-4 rounded-xl border border-brand-orange/10">
                                      <div className="flex gap-3">
                                         <button 
                                           onClick={() => {
                                             setHasLaunched(true);
                                           }}
                                           className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-black transition-all"
                                         >
                                           <Send size={14} /> Send Personalized Outreach
                                         </button>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingOverlay({ onComplete, setView, onOpenProfile, onCloseProfile, onSetMobileDetail }: { onComplete: () => void, setView: (v: View) => void, onOpenProfile: () => void, onCloseProfile: () => void, onSetMobileDetail: (show: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [bounds, setBounds] = useState<DOMRect | null>(null);

  const steps = [
    {
      title: "Welcome to Foodie v2",
      description: "We've rebuilt the Account Manager experience. Let's show you around the key features.",
      targetId: null,
      action: "Start Tour"
    },
    {
      title: "Smart Inbox",
      description: "Manage all incoming wholesale inquiries here. AI prepares drafts based on your current inventory.",
      targetId: "nav-inbox",
      mobileTargetId: "mob-nav-inbox",
      action: "Next",
      onEnter: () => setView('inbox')
    },
    {
      title: "Buyer Inquiries",
      description: "Each row shows the buyer, their company, and context signals like VIP status or price sensitivity.",
      targetId: "onboarding-message",
      action: "Next",
      onEnter: () => { setView('inbox'); onSetMobileDetail(false); }
    },
    {
      title: "Buyer Profile",
      description: "Click the buyer's photo at the top of any conversation to instantly pull up their full profile: order history, engagement score, relationship notes, and AI tone preferences.",
      targetId: "buyer-profile-toggle",
      action: "Next",
      onEnter: () => { onSetMobileDetail(true); setTimeout(onOpenProfile, 200); }
    },
    {
      title: "AI Draft Response",
      description: "Every inbound inquiry gets an AI-generated reply pre-loaded with relationship context. Edit the tone, tweak the copy, and hit Send. The AI learns from your changes.",
      targetId: "ai-draft-area",
      action: "Next",
      onEnter: () => { onCloseProfile(); onSetMobileDetail(true); }
    },
    {
      title: "Targeted Outreach",
      description: "Launch personalized bulk campaigns for seasonal harvests. The AI writes a unique draft for each buyer based on their order history.",
      targetId: "nav-campaigns",
      mobileTargetId: "mob-nav-campaigns",
      action: "Next",
      onEnter: () => setView('campaigns')
    },
    {
      title: "Your Profile",
      description: "Click the Profile icon anytime to see your portfolio value, draft campaigns, and pending outreach at a glance.",
      targetId: "nav-profiles",
      mobileTargetId: "mob-nav-profiles",
      action: "Get Started",
      onEnter: () => setView('profiles')
    }
  ];

  const currentStep = steps[step];

  useEffect(() => {
    setBounds(null);

    const measureBounds = () => {
      const ids = [currentStep.targetId, (currentStep as any).mobileTargetId].filter(Boolean) as string[];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setBounds(rect);
            return;
          }
        }
      }
      setBounds(null);
    };

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      // Steps 3 and 4 target elements inside MessageDetailView which is hidden on mobile
      // when showMobileDetail is false — force it visible so bounds are measurable
      if (isMobile && (step === 3 || step === 4)) {
        onSetMobileDetail(true);
        setTimeout(measureBounds, 100);
      } else {
        measureBounds();
      }
    };

    const timer = setTimeout(measureBounds, 150);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [step, currentStep.targetId]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      const nextStep = step + 1;
      if (steps[nextStep].onEnter) steps[nextStep].onEnter?.();
      setStep(nextStep);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Background Dimming with Hole */}
      <svg className="absolute inset-0 pointer-events-auto" style={{ width: '100%', height: '100%' }}>
        <defs>
          <mask id="onboarding-mask">
            <rect width="100%" height="100%" fill="white" />
            {bounds && (
              <rect 
                x={bounds.x - 8} 
                y={bounds.y - 8} 
                width={bounds.width + 16} 
                height={bounds.height + 16} 
                rx="12" 
                fill="black" 
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.7)"
          mask="url(#onboarding-mask)"
          onClick={handleNext}
          style={{ cursor: 'pointer' }}
        />
      </svg>

      {/* Tooltip */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: bounds
              ? Math.max(20, Math.min(
                  window.innerHeight - 320,
                  bounds.bottom + 340 < window.innerHeight
                    ? bounds.bottom + 20
                    : bounds.top > 340
                      ? bounds.top - 320
                      : Math.round((window.innerHeight - 300) / 2)
                ))
              : 0,
            x: bounds
              ? Math.max(20, Math.min(window.innerWidth - 340, bounds.left + (bounds.width / 2) - 160))
              : 0,
            scale: 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{ 
            position: bounds ? 'absolute' : 'relative',
            top: bounds ? 0 : 'auto',
            left: bounds ? 0 : 'auto'
          }}
          className="bg-white rounded-3xl p-8 w-80 shadow-2xl pointer-events-auto border border-gray-100"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Step {step + 1} of {steps.length}</span>
              <button onClick={onComplete} className="cursor-pointer text-gray-300 hover:text-gray-500"><X size={16} /></button>
            </div>
            <h3 className="text-xl font-bold font-display text-gray-900">{currentStep.title}</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">{currentStep.description}</p>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleNext}
                className="cursor-pointer flex-1 h-12 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                {currentStep.action} <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-4 bg-brand-orange' : 'w-1 bg-gray-200'}`} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      onLogin();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-brand-blue/5 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-brand-orange rounded-2xl items-center justify-center text-white mb-6 shadow-xl shadow-brand-orange/20">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">Welcome to Foodie</h1>
          <p className="text-gray-500 font-medium italic">Empowering Specialty Account Managers</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="alex.rossi@foodie.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-brand-orange transition-colors">
                  <div className="w-2 h-2 bg-brand-orange rounded-sm opacity-0 group-hover:opacity-20 translate-all" />
                </div>
                <span className="text-xs font-bold text-gray-500">Remember session</span>
              </label>
              <button type="button" className="text-xs font-bold text-brand-orange hover:underline">Forgot access?</button>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-gray-200/50 hover:bg-black hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              {isSubmitting ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>Sign in as Manager <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Internal Tooling &bull; Specialty Foods &bull; v2.4.1
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center space-y-2">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Secure Access Protocol Active</p>
          <div className="flex justify-center gap-4">
            <div className="w-2 h-2 bg-green-500/20 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-green-500/40 rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-green-500/60 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * COMMON COMPONENTS
 */


