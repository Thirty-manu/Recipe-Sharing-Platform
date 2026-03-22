import { useState, useEffect, useRef } from "react";
import { collection, addDoc, onSnapshot, orderBy, query, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, isAdmin } from "../firebase/firestore";
import { Send, Trash2, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { useNotificationSound } from "../hooks/useNotificationSound";
import toast from "react-hot-toast";

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const bottomRef = useRef(null);
  const isFirstLoad = useRef(true);
  const prevCount = useRef(0);
  const admin = isAdmin(user);
  const { playSound } = useNotificationSound();

  useEffect(() => {
    const q = query(collection(db, "chat"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Play sound when new message arrives from someone else
      if (!isFirstLoad.current && msgs.length > prevCount.current) {
        const latest = msgs[msgs.length - 1];
        if (latest.authorId !== user.uid && soundOn) {
          playSound();
        }
      }

      if (isFirstLoad.current) isFirstLoad.current = false;
      prevCount.current = msgs.length;

      setMessages(msgs);
      setLoading(false);
    }, () => setLoading(false));
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => { unsub(); clearTimeout(timer); };
  }, [soundOn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, "chat"), {
        text: text.trim(),
        authorId: user.uid,
        authorName: user.name,
        authorAvatar: user.avatar,
        authorEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch { toast.error("Couldn't send message"); }
  };

  const deleteMessage = async (id) => {
    try { await deleteDoc(doc(db, "chat", id)); toast.success("Message deleted"); }
    catch { toast.error("Couldn't delete"); }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = ts.toDate?.() || new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const d = ts.toDate?.() || new Date(ts);
    return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  };

  const grouped = messages.reduce((acc, msg) => {
    const date = msg.createdAt ? formatDate(msg.createdAt) : "Just now";
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  const SkeletonMsg = ({ right }) => (
    <div style={{ display: "flex", justifyContent: right ? "flex-end" : "flex-start", marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: right ? "row-reverse" : "row" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--input-border)", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: right ? "flex-end" : "flex-start" }}>
          <div style={{ width: 80, height: 10, borderRadius: 4, background: "var(--input-border)", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ width: 160, height: 36, borderRadius: 12, background: "var(--input-border)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* Sound toggle bar */}
      <div style={{
        padding: "8px 20px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </p>
        <button onClick={() => setSoundOn(s => !s)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
          background: soundOn ? "rgba(88,101,242,.12)" : "var(--bg-card)",
          border: `1px solid ${soundOn ? "rgba(88,101,242,.3)" : "var(--border)"}`,
          borderRadius: 8, color: soundOn ? "var(--accent)" : "var(--text-muted)",
          fontSize: 12, fontWeight: 600, transition: "all .2s"
        }}>
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {soundOn ? "Sound On" : "Sound Off"}
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }} className="page-scroll">
        {!loading && messages.length === 0 && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(88,101,242,.1)", border: "1px solid rgba(88,101,242,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageCircle size={28} color="var(--accent)" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>No messages yet</p>
            <p style={{ fontSize: 14 }}>Be the first to say something!</p>
          </div>
        )}

        {loading && (
          <>
            <SkeletonMsg right={false} />
            <SkeletonMsg right={true} />
            <SkeletonMsg right={false} />
            <SkeletonMsg right={true} />
          </>
        )}

        {!loading && Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>{date}</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {msgs.map((msg, i) => {
              const isMe = msg.authorId === user.uid;
              const showAvatar = i === 0 || msgs[i - 1]?.authorId !== msg.authorId;
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: isMe ? "row-reverse" : "row", maxWidth: "75%" }}>
                    {!isMe && (
                      <div style={{ width: 32, flexShrink: 0 }}>
                        {showAvatar && (
                          <img src={msg.authorAvatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                        )}
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: isMe ? "flex-end" : "flex-start" }}>
                      {showAvatar && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {!isMe && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{msg.authorName}</span>}
                          {msg.authorEmail === "serem695@gmail.com" && (
                            <span style={{ fontSize: 10, background: "rgba(88,101,242,.2)", color: "var(--accent)", padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>Admin</span>
                          )}
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatTime(msg.createdAt)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexDirection: isMe ? "row-reverse" : "row" }}>
                        <div style={{
                          padding: "10px 14px",
                          borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          background: isMe ? "var(--accent)" : "var(--bg-card)",
                          border: isMe ? "none" : "1px solid var(--border)",
                          color: isMe ? "#fff" : "var(--text-primary)",
                          fontSize: 14, lineHeight: 1.5, wordBreak: "break-word"
                        }}>
                          {msg.text}
                        </div>
                        {(admin || isMe) && (
                          <button onClick={() => deleteMessage(msg.id)}
                            style={{ background: "none", color: "var(--text-muted)", padding: 4, borderRadius: 6, transition: "color .15s" }}
                            onMouseOver={e => e.currentTarget.style.color = "var(--danger)"}
                            onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 20px 20px", borderTop: "1px solid var(--border)",
        display: "flex", gap: 10, alignItems: "flex-end", background: "var(--bg-main)"
      }}>
        <img src={user.avatar} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginBottom: 2 }} />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Message the community... (Enter to send)"
          rows={1}
          style={{
            flex: 1, padding: "10px 14px",
            background: "var(--bg-card)", border: "1px solid var(--input-border)",
            borderRadius: 12, color: "var(--text-primary)", fontSize: 14,
            resize: "none", lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
            fontFamily: "var(--font)"
          }}
          onInput={e => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
        />
        <button onClick={sendMessage} disabled={!text.trim()}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: text.trim() ? "var(--accent)" : "var(--input-border)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background .2s", marginBottom: 2
          }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
