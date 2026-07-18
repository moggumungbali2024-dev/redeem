const fs = require('fs');

let content = fs.readFileSync('src/views/UserApp.tsx', 'utf8');

const oldHeader = `{/* Header Image */}
      <div className="relative h-48 md:h-64 w-full border-b-[3px] border-black max-w-[600px] mx-auto shrink-0">
        <img src={partner.images[0] || partner.logo} className="w-full h-full object-cover" alt="header" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2.5 bg-white border-[3px] border-black rounded-full text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all z-20">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="p-4 bg-[#FFF8F0] flex-1 flex flex-col gap-4 w-full max-w-[600px] mx-auto pb-12">
        {/* Info Header */}
        <div className="bg-white p-4 border-[3px] border-black rounded-[24px] shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-black text-black uppercase leading-tight">{partner.name}</h1>
            <div className="flex items-center gap-1 text-[#FDD835] font-black shrink-0 text-sm">
              <Star size={16} fill="#FDD835" stroke="black" strokeWidth={2.5} />
              <span className="text-black">4.8</span>
            </div>
          </div>
          
          <div className="flex gap-2 items-center mb-3">
            {/* Clickable Location Badge */}
            <button 
              onClick={() => handleLink('maps', partner.googleMapsUrl || '')}
              className="flex items-center gap-1.5 text-xs font-black text-[#1E88E5] bg-stone-50 hover:bg-stone-100 border-2 border-black px-2.5 py-1.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all"
              title="Open in Google Maps"
            >
              <MapPin size={14} strokeWidth={3} /> {partner.distance}km ({partner.eta}m)
            </button>
            
            {!checkInTime && (
              <button onClick={handleCheckIn} className="flex-1 bg-[#FDD835] hover:bg-[#FBC02D] border-2 border-black py-1.5 rounded-xl font-black text-xs md:text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all uppercase whitespace-nowrap">
                {t({ ko: "체크인", en: "Check In", id: "Check-In" })}
              </button>
            )}
            {checkInTime && (
              <div className="flex-1 bg-[#43A047] text-white border-2 border-black py-1.5 rounded-xl font-black text-xs md:text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase text-center flex items-center justify-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                {t({ ko: "체크인 완료 (+50P)", en: "Checked In (+50P)", id: "Sudah Check-In (+50P)" })}
              </div>
            )}
          </div>

          <p className="text-xs md:text-sm font-semibold text-stone-600 leading-relaxed border-t-2 border-dashed border-stone-200 pt-3">
            {t(partner.description)}
          </p>
        </div>`;

const newHeader = `{/* Header Image / Video */}
      <div className="relative h-48 md:h-64 w-full border-b-[3px] border-black max-w-[600px] mx-auto shrink-0 bg-stone-900">
        {(partner.banner || partner.images[0] || partner.logo || '').endsWith('.mp4') ? (
          <video src={partner.banner || partner.images[0] || partner.logo} className="w-full h-full object-cover" autoPlay loop muted playsInline />
        ) : (
          <img src={partner.banner || partner.images[0] || partner.logo} className="w-full h-full object-cover" alt="header" />
        )}
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2.5 bg-white border-[3px] border-black rounded-full text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all z-20">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="p-4 bg-[#FFF8F0] flex-1 flex flex-col gap-4 w-full max-w-[600px] mx-auto pb-12">
        {/* Info Header */}
        <div className="bg-white p-4 border-[3px] border-black rounded-[24px] shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          
          <div className="flex items-start gap-3 mb-3">
            <img src={partner.logo} alt="logo" className="w-16 h-16 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] object-cover bg-white shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h1 className="text-xl md:text-2xl font-black text-black uppercase leading-tight line-clamp-2">{partner.name}</h1>
                <div className="flex items-center gap-1 text-[#FDD835] font-black shrink-0 text-sm">
                  <Star size={16} fill="#FDD835" stroke="black" strokeWidth={2.5} />
                  <span className="text-black">4.8</span>
                </div>
              </div>
              
              <div className="flex gap-2 items-center mt-2">
                {/* Clickable Location Badge */}
                <button 
                  onClick={() => handleLink('maps', partner.googleMapsUrl || '')}
                  className="flex items-center gap-1.5 text-xs font-black text-[#1E88E5] bg-stone-50 hover:bg-stone-100 border-2 border-black px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all shrink-0"
                  title="Open in Google Maps"
                >
                  <MapPin size={12} strokeWidth={3} /> {partner.distance}km ({partner.eta}m)
                </button>
                
                {!checkInTime && (
                  <button onClick={handleCheckIn} className="flex-1 bg-[#FDD835] hover:bg-[#FBC02D] border-2 border-black py-1 rounded-xl font-black text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all uppercase whitespace-nowrap min-w-[70px]">
                    {t({ ko: "체크인", en: "Check In", id: "Check-In" })}
                  </button>
                )}
                {checkInTime && (
                  <div className="flex-1 bg-[#43A047] text-white border-2 border-black py-1 rounded-xl font-black text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase text-center flex items-center justify-center gap-1.5 whitespace-nowrap min-w-[70px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {t({ ko: "완료", en: "Done", id: "Selesai" })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm font-semibold text-stone-600 leading-relaxed border-t-2 border-dashed border-stone-200 pt-3">
            {t(partner.description)}
          </p>
        </div>`;

content = content.replace(oldHeader, newHeader);
fs.writeFileSync('src/views/UserApp.tsx', content);
console.log("Updated PartnerDetail UI");
