import React, { useEffect, useRef } from 'react';

const PURCHASE_EVENTS = [
  { buyer: 'Emeka', location: 'Surulere', product: 'Infinix XPower30 30000mAh', emoji: '🔋', price: '₦22,000' },
  { buyer: 'Ngozi', location: 'Ikeja', product: 'Infinix XPower20 GO 20000mAh', emoji: '⚡', price: '₦12,500' },
  { buyer: 'Chisom', location: 'Lekki', product: 'Infinix XPower10 GO 10000mAh', emoji: '📱', price: '₦9,000' },
  { buyer: 'Tunde', location: 'Yaba', product: 'Wireless Earbuds Pro', emoji: '🎧', price: '₦8,500' },
  { buyer: 'Blessing', location: 'Ajah', product: 'Infinix XPower30 30000mAh', emoji: '🔋', price: '₦22,000' },
  { buyer: 'Kelechi', location: 'Oshodi', product: 'Type-C Fast Charger 65W', emoji: '🔌', price: '₦4,500' },
  { buyer: 'Adaeze', location: 'Victoria Island', product: 'Infinix XPower20 GO 20000mAh', emoji: '⚡', price: '₦12,500' },
  { buyer: 'Femi', location: 'Ikorodu', product: 'Phone Stand + USB Hub Combo', emoji: '💻', price: '₦6,200' },
  { buyer: 'Amaka', location: 'Ojota', product: 'Infinix XPower10 GO 10000mAh', emoji: '📱', price: '₦9,000' },
  { buyer: 'Ibrahim', location: 'Apapa', product: 'Infinix XPower30 30000mAh x3', emoji: '🔋', price: '₦56,400' },
  { buyer: 'Yetunde', location: 'Maryland', product: 'Wireless Mouse', emoji: '🖱️', price: '₦3,800' },
  { buyer: 'Chukwuma', location: 'Gbagada', product: 'Phone Cooling Fan', emoji: '❄️', price: '₦2,500' },
  { buyer: 'Aisha', location: 'Festac', product: 'Smart Watch Series 6', emoji: '⌚', price: '₦15,000' },
  { buyer: 'Obinna', location: 'Magodo', product: 'USB-C Cable 2m', emoji: '🔌', price: '₦1,200' },
  { buyer: 'Folake', location: 'Mushin', product: 'Bluetooth Speaker Mini', emoji: '🔊', price: '₦7,500' },
  { buyer: 'Segun', location: 'Surulere', product: 'Gaming Keyboard RGB', emoji: '⌨️', price: '₦12,000' },
  { buyer: 'Chiamaka', location: 'Ikoyi', product: 'Phone Case Transparent', emoji: '📱', price: '₦1,500' },
  { buyer: 'Ahmed', location: 'Ketu', product: 'Infinix XPower10 GO 10000mAh', emoji: '📱', price: '₦9,000' },
  { buyer: 'Funmi', location: 'Apapa', product: 'Wireless Earbuds', emoji: '🎧', price: '₦5,500' },
  { buyer: 'Chidera', location: 'Ajegunle', product: 'Type-C Fast Charger 33W', emoji: '🔌', price: '₦3,500' },
  { buyer: 'Bolu', location: 'Egbeda', product: 'Phone Holder Car Mount', emoji: '📱', price: '₦2,800' },
  { buyer: 'Kehinde', location: 'Alimosho', product: 'Infinix XPower30 30000mAh', emoji: '🔋', price: '₦22,000' },
  { buyer: 'Nneka', location: 'Badagry', product: 'USB Hub 4-Port', emoji: '🔌', price: '₦4,200' },
  { buyer: 'Damilola', location: 'Ilupeju', product: 'Wireless Charger Pad', emoji: '📶', price: '₦6,000' },
  { buyer: 'Oluwatobi', location: 'Ogudu', product: 'Screen Protector Tempered Glass', emoji: '🛡️', price: '₦800' },
  { buyer: 'Zainab', location: 'Epe', product: 'Infinix XPower20 GO 20000mAh', emoji: '⚡', price: '₦12,500' },
  { buyer: 'Victor', location: 'Agege', product: 'Laptop Cooling Pad', emoji: '💻', price: '₦8,900' },
  { buyer: 'Grace', location: 'Iyana Ipaja', product: 'Selfie Ring Light', emoji: '💡', price: '₦4,500' },
  { buyer: 'Uche', location: 'Bariga', product: 'Memory Card 64GB', emoji: '💳', price: '₦3,200' },
  { buyer: 'Biodun', location: 'Obalende', product: 'Type-C to Lightning Cable', emoji: '🔌', price: '₦2,500' },
  { buyer: 'Ifeanyi', location: 'Satellite', product: 'Wireless Gaming Mouse', emoji: '🖱️', price: '₦7,800' },
  { buyer: 'Salamatu', location: 'Somolu', product: 'Phone Stand Adjustable', emoji: '📐', price: '₦2,200' },
  { buyer: 'Taiwo', location: 'Isolo', product: 'Infinix XPower10 GO 10000mAh x2', emoji: '📱', price: '₦17,100' },
  { buyer: 'Chinedu', location: 'Ijora', product: 'Bluetooth Headphones', emoji: '🎧', price: '₦9,500' },
  { buyer: 'Hadiza', location: 'Ojo', product: 'USB Flash Drive 32GB', emoji: '💾', price: '₦2,800' },
  { buyer: 'Mayowa', location: 'Oregun', product: 'Laptop Bag 15.6"', emoji: '💼', price: '₦5,500' },
  { buyer: 'Chika', location: 'Ejigbo', product: 'Car Phone Charger Dual USB', emoji: '🚗', price: '₦2,000' },
  { buyer: 'Musa', location: 'Amuwo', product: 'Infinix XPower30 30000mAh', emoji: '🔋', price: '₦22,000' },
  { buyer: 'Precious', location: 'Berger', product: 'Tripod Stand for Phone', emoji: '📷', price: '₦3,800' },
  { buyer: 'Emeka Jr', location: 'Palmgrove', product: 'External SSD 256GB', emoji: '💻', price: '₦18,500' },
  { buyer: 'Fatima', location: 'Ikotun', product: 'Wireless Keyboard & Mouse Combo', emoji: '⌨️', price: '₦8,500' },
  { buyer: 'Tolu', location: 'Okota', product: 'Phone Case with Ring Holder', emoji: '📱', price: '₦1,800' },
  { buyer: 'Nnenna', location: 'CMS', product: 'Infinix XPower20 GO 20000mAh', emoji: '⚡', price: '₦12,500' },
  { buyer: 'Joseph', location: 'Mile 2', product: 'HDMI Cable 3m', emoji: '🔌', price: '₦2,500' },
  { buyer: 'Chioma', location: 'Abule Egba', product: 'Webcam 1080p HD', emoji: '📹', price: '₦11,000' },
  { buyer: 'Emeka K', location: 'Ojodu', product: 'Power Bank 50000mAh', emoji: '🔋', price: '₦28,000' },
  { buyer: 'Rukayat', location: 'Ijesha', product: 'Earpiece with Mic', emoji: '🎧', price: '₦1,500' },
  { buyer: 'Olumide', location: 'Ogba', product: 'Bluetooth Adapter USB', emoji: '📶', price: '₦2,200' },
  { buyer: 'Jennifer', location: 'Iju', product: 'Infinix XPower10 GO 10000mAh', emoji: '📱', price: '₦9,000' },
  { buyer: 'Adamu', location: 'Orile', product: 'Gaming Headset RGB', emoji: '🎧', price: '₦13,500' },
  { buyer: 'Nkechi', location: 'Costain', product: 'Phone Tripod with Remote', emoji: '📷', price: '₦4,500' },
  { buyer: 'Michael', location: 'Alakuko', product: 'Type-C Multi-Port Hub', emoji: '🔌', price: '₦5,800' },
  { buyer: 'Amina', location: 'Ikate', product: 'Wireless Earbuds Pro Max', emoji: '🎧', price: '₦12,000' },
  { buyer: 'Kola', location: 'Anthony', product: 'Laptop Stand Aluminum', emoji: '💻', price: '₦7,200' },
  { buyer: 'Esther', location: 'Lasu', product: 'Car Inverter 150W', emoji: '🚗', price: '₦9,500' },
];

const tickerText = PURCHASE_EVENTS
  .map(e => `${e.buyer} (${e.location}) just bought ${e.product} for ${e.price}`)
  .join('          •          ');

export const WhatsAppTestimonialPopup: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Wait one frame for layout to settle before reading scrollWidth
    const startTicker = () => {
      const halfWidth = el.scrollWidth / 2;
      if (halfWidth === 0) return;

      const step = () => {
        posRef.current += 0.2;
        if (posRef.current >= halfWidth) posRef.current = 0;
        el.style.transform = `translateX(-${posRef.current}px)`;
        rafRef.current = requestAnimationFrame(step);
      };

      rafRef.current = requestAnimationFrame(step);
    };

    // Small delay to ensure DOM is laid out
    const timer = setTimeout(startTicker, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes zt-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .zt-pulse { animation: zt-pulse 1.5s ease-in-out infinite; }
      `}</style>
      <div
        style={{
          width: '100%',
          height: '28px',
          background: '#060E1E',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* LIVE badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0 12px',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          height: '100%',
          flexShrink: 0,
        }}>
          <span
            className="zt-pulse"
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#4ade80',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{
            color: '#4ade80',
            fontWeight: 700,
            fontSize: '9px',
            letterSpacing: '0.15em',
            flexShrink: 0,
          }}>
            LIVE
          </span>
        </div>

        {/* Scrolling track */}
        <div style={{ flex: 1, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10.5px', paddingRight: '80px' }}>
              {tickerText}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10.5px', paddingRight: '80px' }}>
              {tickerText}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
