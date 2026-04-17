export function generateWhatsAppMessage({ workerName, amount, city, zone, language = "en" }) {
  const messages = {
    en: `✅ ShieldX paid me ₹${amount} automatically when flooding hit ${zone}, ${city}. No form. No call. It just arrived in my UPI. Try it: ShieldXklu.vercel.app`,
    
    hi: `✅ ShieldX ne mujhe ₹${amount} diya jab ${zone}, ${city} mein flood aaya. Koi form nahi. Koi call nahi. Seedha UPI mein aa gaya. Try karo: ShieldXklu.vercel.app`,
    
    te: `✅ ${zone}, ${city}లో వరద వచ్చినప్పుడు ShieldX నాకు ₹${amount} automatically ఇచ్చింది. Form లేదు. Call లేదు. నా UPI కి వచ్చింది. Try చేయండి: ShieldXklu.vercel.app`,
    
    ta: `✅ ${zone}, ${city}யில் வெள்ளம் வந்தபோது ShieldX என்னிடம் ₹${amount} தானாகவே அனுப்பியது. படிவம் இல்லை. அழைப்பு இல்லை. என் UPI க்கு வந்தது. முயற்சிக்கவும்: ShieldXklu.vercel.app`,
    
    kn: `✅ ${zone}, ${city}ದಲ್ಲಿ ಪ್ರವಾಹ ಬಂದಾಗ ShieldX ನನಗೆ ₹${amount} ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನೀಡಿತು. ಫಾರ್ಮ್ ಇಲ್ಲ. ಕರೆ ಇಲ್ಲ. ನನ್ನ UPI ಗೆ ಬಂತು. ಪ್ರಯತ್ನಿಸಿ: ShieldXklu.vercel.app`,
    
    mr: `✅ ${zone}, ${city}मध्ये पूर आल्यावर ShieldX ने मला ₹${amount} आपोआप दिले. कोणता फॉर्म नाही. कोणता फोन नाही. थेट UPI मध्ये आले. वापरून पहा: ShieldXklu.vercel.app`,
  };
  
  return messages[language] || messages.en;
}

export function shareOnWhatsApp({ workerName, amount, city, zone, language }) {
  const message = generateWhatsAppMessage({ workerName, amount, city, zone, language });
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/?text=${encoded}`;
  window.open(url, '_blank');
}
