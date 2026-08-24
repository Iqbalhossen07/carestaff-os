import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MessageSquare, Send } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function FamilyMessagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/family/login");
  }

  const userId = session.user.id;

  // Fetch received messages
  const messages = await prisma.message.findMany({
    where: { 
      OR: [
        { receiverId: userId },
        { senderId: userId }
      ]
    },
    include: {
      sender: true,
      receiver: true
    },
    orderBy: { timestamp: 'asc' }
  });

  // Get Admin to send messages to
  const adminUser = await prisma.user.findFirst({
    where: { careHomeId: session.user.careHomeId, userType: "SUPER_ADMIN" }
  });

  async function sendMessage(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    if (!content || !adminUser) return;

    await prisma.message.create({
      data: {
        content,
        senderId: userId,
        receiverId: adminUser.id
      }
    });
    revalidatePath("/family/messages");
  }

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Care Home Administration</h2>
          <p className="text-xs text-gray-500">Send a direct message to the admin team.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No messages yet. Send a message to start a conversation.
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === userId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form action={sendMessage} className="flex gap-2">
          <input 
            type="text" 
            name="content"
            required
            placeholder="Type your message here..." 
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />
          <button 
            type="submit" 
            className="w-12 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
