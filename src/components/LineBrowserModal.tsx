import { useState } from 'react';
import { ExternalLink, Copy, Check, Smartphone, Compass, X } from 'lucide-react';
import { isIOS, isAndroid, openExternalBrowser } from '../utils/browser';

interface LineBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LineBrowserModal({ isOpen, onClose }: LineBrowserModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    const currentUrl = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const isIosDevice = isIOS();
  const isAndroidDevice = isAndroid();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E0EBE8] text-[#2F3437] max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A7A7A] hover:text-[#2F3437] p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header Badge & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl mb-3 shadow-inner">
            <Compass size={30} />
          </div>
          <h3 className="text-xl font-bold text-[#2F3437]">不支援在 LINE 內登入</h3>
          <p className="text-xs text-[#7A7A7A] mt-1.5 leading-relaxed">
            Google 安全機制限制在 LINE 內建瀏覽器登入。<br />
            請改用 <strong className="text-[#2F3437]">Safari</strong> 或 <strong className="text-[#2F3437]">Chrome</strong> 開啟本網站。
          </p>
        </div>

        {/* Operating System Instructions */}
        <div className="space-y-4 mb-6">
          {/* iOS Instructions */}
          {(isIosDevice || !isAndroidDevice) && (
            <div className="bg-[#F6F5F2] p-4 rounded-2xl border border-[#C9D6D0]/50">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2F3437] mb-2">
                <Smartphone size={16} className="text-[#7FA8A4]" />
                <span>iPhone / iPad (iOS) 開啟步驟：</span>
              </div>
              <ol className="text-xs text-[#555] space-y-1.5 pl-5 list-decimal font-medium leading-relaxed">
                <li>點擊畫面右下角（或右上角）的 <strong className="text-[#2F3437]">「...」</strong> 或 <strong className="text-[#2F3437]">「分享」</strong> 圖示</li>
                <li>選擇 <strong className="text-[#7FA8A4]">「在 Safari 中開啟」</strong></li>
              </ol>
            </div>
          )}

          {/* Android Instructions */}
          {(isAndroidDevice || !isIosDevice) && (
            <div className="bg-[#F6F5F2] p-4 rounded-2xl border border-[#C9D6D0]/50">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2F3437] mb-2">
                <Smartphone size={16} className="text-amber-600" />
                <span>Android 手機開啟步驟：</span>
              </div>
              <ol className="text-xs text-[#555] space-y-1.5 pl-5 list-decimal font-medium leading-relaxed">
                <li>點擊畫面右上角的 <strong className="text-[#2F3437]">「...」</strong> 選單</li>
                <li>選擇 <strong className="text-amber-600">「以其他應用程式開啟」</strong> 或 <strong className="text-amber-600">「在 Chrome 中開啟」</strong></li>
              </ol>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Try Auto Open for Android / LINE */}
          <button
            onClick={openExternalBrowser}
            className="w-full bg-[#7FA8A4] hover:bg-[#6C9793] text-white py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <ExternalLink size={18} />
            <span>嘗試自動在外部瀏覽器開啟</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full bg-white border-2 border-[#E0EBE8] hover:bg-[#F6F5F2] text-[#2F3437] py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check size={18} className="text-emerald-600" />
                <span className="text-emerald-600">已複製網址！請貼至 Safari/Chrome</span>
              </>
            ) : (
              <>
                <Copy size={18} className="text-[#7FA8A4]" />
                <span>複製網址 (可貼上至外部瀏覽器)</span>
              </>
            )}
          </button>

          {/* Dismiss */}
          <button
            onClick={onClose}
            className="w-full text-xs text-[#7A7A7A] hover:text-[#2F3437] py-2 font-bold transition-colors"
          >
            關閉提示
          </button>
        </div>

      </div>
    </div>
  );
}
