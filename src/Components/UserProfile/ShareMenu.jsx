import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Copy link
  const handleCopy = () => {
    navigator.clipboard.writeText("https://yourlink.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Share Button */}
      <Button
        onClick={() => setOpen(!open)}
        className="px-8 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg flex items-center gap-2"
      >
        <Share2 size={18} />
        Share
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute mt-3 w-64 bg-white shadow-xl rounded-xl p-2 z-50 border border-gray-100"
          >
            {/* Copy link */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
                <Copy size={16} className="text-gray-600" />
              </span>
              <span className="font-medium text-gray-700 text-sm">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>

            <div className="my-2 border-t border-gray-100" />

            {/* Social links */}
            <a
              href="https://wa.me/?text=Check%20this%20out!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-green-50 transition-all"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100">
                <img
                  src="https://img.icons8.com/color/24/whatsapp.png"
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
              </span>
              <span className="font-medium text-gray-700 text-sm">
                WhatsApp
              </span>
            </a>

            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https://yourlink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-blue-50 transition-all"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100">
                <Linkedin size={18} className="text-blue-600" />
              </span>
              <span className="font-medium text-gray-700 text-sm">
                LinkedIn
              </span>
            </a>

            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://yourlink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-blue-50 transition-all"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100">
                <Facebook size={18} className="text-blue-500" />
              </span>
              <span className="font-medium text-gray-700 text-sm">
                Facebook
              </span>
            </a>

            <a
              href="https://twitter.com/intent/tweet?url=https://yourlink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-200">
                <Twitter size={18} className="text-gray-800" />
              </span>
              <span className="font-medium text-gray-700 text-sm">
                Twitter / X
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
