import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';
import { useTranslation } from '@/i18n';

export function FloatingWhatsApp() {
  const { language } = useTranslation();

  const defaultText = language === 'bn'
    ? 'হ্যালো লস্কর ট্রেডার্স, আমি ডায়াপার অর্ডার এবং পরামর্শের জন্য যোগাযোগ করছি।'
    : 'Hello Lashker Traders, I would like to order baby diapers or inquire about wholesale supply.';

  const url = `https://wa.me/${STORE_CONFIG.whatsappCleanNumber}?text=${encodeURIComponent(defaultText)}`;

  return (
    <aside aria-label="WhatsApp Direct Support">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Ordering and Support"
        className="fixed floating-whatsapp-container right-4 sm:right-6 z-30 group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border-2 border-white/80"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="text-xs font-bold tracking-tight">
          {language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার' : 'WhatsApp Order'}
        </span>
      </a>
    </aside>
  );
}
