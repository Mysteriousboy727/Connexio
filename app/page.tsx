"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  author: { id?: string; username?: string; name: string; role: string; avatar: string };
  content: string;
  hashtags: string[];
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  liked: boolean;
  commentText: string;
}

interface Friend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  added: boolean;
}

interface Story {
  id: number;
  handle: string;
  avatar: string;
}

interface SearchUser {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
}

interface ProfileDetails extends SearchUser {
  website?: string;
  location?: string;
  posts_count?: number;
  followers_count?: number;
  following_count?: number;
}

const STORIES: Story[] = [
  { id: 1, handle: "x_ae-23b", avatar: "https://i.pravatar.cc/56?img=1" },
  { id: 2, handle: "maisenpai", avatar: "https://i.pravatar.cc/56?img=2" },
  { id: 3, handle: "saylortwift", avatar: "https://i.pravatar.cc/56?img=3" },
  { id: 4, handle: "johndoe", avatar: "https://i.pravatar.cc/56?img=4" },
  { id: 5, handle: "maryjane2", avatar: "https://i.pravatar.cc/56?img=5" },
  { id: 6, handle: "obama", avatar: "https://i.pravatar.cc/56?img=6" },
  { id: 7, handle: "x_ae-21", avatar: "https://i.pravatar.cc/56?img=7" },
  { id: 8, handle: "x_ae-23b", avatar: "https://i.pravatar.cc/56?img=8" },
];

const INITIAL_FRIENDS: Friend[] = [];

const NAV_ITEMS = [
  { label: "Feed", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Stories", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { label: "Friends", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Subscription", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Help & Support", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

function StoriesPage({ onOpenStory }: { onOpenStory: (story: Story) => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:pb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Stories</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {STORIES.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => onOpenStory(s)}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-md transition-shadow text-left"
          >
            <div className="relative h-48 bg-gradient-to-br from-[#5555ee]/20 to-purple-100">
              <img src={s.avatar} alt={s.handle} className="w-full h-full object-cover opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#5555ee] p-0.5">
                    <img src={s.avatar} alt={s.handle} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-white text-sm font-medium">{s.handle}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
        <div className="bg-white rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-[#5555ee]/30 hover:border-[#5555ee] transition-colors flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#5555ee]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-[#5555ee]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#5555ee]">Add Story</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FriendsPage({ friends, onAdd }: { friends: Friend[]; onAdd: (id: string) => void }) {
  const acceptedFriends = friends.filter(f => f.added);
  const suggestions = friends.filter(f => !f.added);

  return (
    <div className="flex-1 overflow-y-auto space-y-8 px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:pb-6">
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-1">People You Follow</h2>
        <p className="text-sm text-gray-400 mb-6">Accounts you have already added</p>
        {acceptedFriends.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-400">
            You have not followed anyone yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {acceptedFriends.map(f => (
              <div key={f.id} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center">
                <img src={f.avatar} alt={f.name} className="w-16 h-16 rounded-full object-cover mb-3" />
                <p className="font-semibold text-gray-800 text-sm leading-tight">{f.name}</p>
                <p className="text-gray-400 text-sm mb-4">{f.handle}</p>
                <button
                  onClick={() => onAdd(f.id)}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-all bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                  Following
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-1">People you may know</h2>
        <p className="text-sm text-gray-400 mb-6">Based on your interests and connections</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {suggestions.map(f => (
            <div key={f.id} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center">
              <img src={f.avatar} alt={f.name} className="w-16 h-16 rounded-full object-cover mb-3" />
              <p className="font-semibold text-gray-800 text-sm leading-tight">{f.name}</p>
              <p className="text-gray-400 text-sm mb-4">{f.handle}</p>
              <button
                onClick={() => onAdd(f.id)}
                className="w-full py-2 rounded-xl text-sm font-semibold transition-all bg-[#5555ee] text-white hover:bg-[#4444cc]"
              >
                Add Friend
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SubscriptionPage() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:pb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1">Subscription</h2>
      <p className="text-sm text-gray-400 mb-6">Upgrade to unlock premium features</p>
      <div className="grid grid-cols-1 gap-4 max-w-lg">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Basic</h3>
            <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1 rounded-full">Current</span>
          </div>
          <p className="text-2xl font-black text-gray-800 mb-4">Free</p>
          {["Create posts", "Like & comment", "Public feed"].map(f => (
            <div key={f} className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600">{f}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#5555ee] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Pro</h3>
            <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">Recommended</span>
          </div>
          <p className="text-2xl font-black text-white mb-1">$9.99 <span className="text-sm font-normal text-white/70">/ month</span></p>
          <p className="text-white/60 text-sm mb-4">Everything in Basic, plus:</p>
          {["Priority feed ranking", "Analytics dashboard", "Verified badge", "Advanced privacy controls"].map(f => (
            <div key={f} className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-white">{f}</span>
            </div>
          ))}
          <button className="w-full mt-4 bg-white text-[#5555ee] font-bold py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}

function UserProfilePage({
  profile,
  posts,
  loading,
  onBack,
}: {
  profile: ProfileDetails | null;
  posts: Post[];
  loading: boolean;
  onBack: () => void;
}) {
  if (!profile) return null;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:pb-6">
      <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5555ee]">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gradient-to-br from-[#5555ee] to-[#4444cc] px-4 py-6 text-white sm:px-6 sm:py-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <img
              src={profile.avatar_url || "https://i.pravatar.cc/72"}
              alt={profile.username}
              className="h-20 w-20 rounded-full border-4 border-white/30 object-cover"
            />
            <div>
              <p className="text-xl font-bold sm:text-2xl">
                {`${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.username}
              </p>
              <p className="text-sm text-white/75">@{profile.username}</p>
              <p className="mt-2 max-w-xl text-sm text-white/80">
                {profile.bio?.trim() || "No bio added yet."}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm sm:gap-6">
            <div><span className="font-bold">{profile.posts_count ?? posts.length}</span> Posts</div>
            <div><span className="font-bold">{profile.followers_count ?? 0}</span> Followers</div>
            <div><span className="font-bold">{profile.following_count ?? 0}</span> Following</div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <p className="text-sm text-gray-400">Loading profile...</p>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Images</h3>
                {posts.filter(post => post.image).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
                    No images posted yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {posts.filter(post => post.image).map(post => (
                      <div key={post.id} className="overflow-hidden rounded-2xl bg-gray-100">
                        <img src={post.image} alt="post" className="h-40 w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Posts</h3>
                {posts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
                    No posts available for this account.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div key={post.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-3 flex items-center gap-3">
                          <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{post.author.name}</p>
                            <p className="text-xs text-gray-400">@{profile.username}</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700">{post.content}</p>
                        {post.image && (
                          <div className="mt-3 overflow-hidden rounded-xl">
                            <img src={post.image} alt="post" className="h-64 w-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ onLogout, onProfileUpdated }: { onLogout: () => void; onProfileUpdated: (user: { id?: string; username?: string; first_name?: string; last_name?: string; avatar_url?: string }) => void }) {
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ displayName: "", username: "", email: "" });
  const [profilePhoto, setProfilePhoto] = useState("https://i.pravatar.cc/56?img=30");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) return;
    const u = JSON.parse(user);
    setProfileData({
      displayName: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || 'User',
      username: u.username || '',
      email: u.email || '',
    });
    setProfilePhoto(u.avatar_url || "https://i.pravatar.cc/56?img=30");
  }, []);

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please choose an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Profile photo must be 2MB or smaller");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(reader.result);
        setProfilePhotoFile(file);
        setProfileError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setProfileError('');
    setProfileSaving(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setProfileError('Not authenticated');
      setProfileSaving(false);
      return;
    }

    try {
      const [first_name, ...rest] = profileData.displayName.split(' ');
      const last_name = rest.join(' ');

      let avatarUrl = profilePhoto;

      if (profilePhotoFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", profilePhotoFile);

        const avatarRes = await fetch('/api/users/me/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: avatarFormData,
        });

        const avatarData = await avatarRes.json();
        if (!avatarRes.ok) {
          setProfileError(avatarData.error || 'Unable to upload profile photo');
          setProfileSaving(false);
          return;
        }

        avatarUrl = avatarData.avatar_url || profilePhoto;
      }

      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name,
          last_name,
          username: profileData.username.trim(),
          avatar_url: avatarUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || 'Unable to update profile');
      } else {
        // Ensure the local user cache and nav state reflect the updated DB record.
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user') || '{}'),
          ...data,
          avatar_url: avatarUrl,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onProfileUpdated(updatedUser);

        // Sync local state in this view and top nav listener
        setProfileData({
          displayName: `${updatedUser.first_name || ''} ${updatedUser.last_name || ''}`.trim() || updatedUser.username || 'User',
          username: updatedUser.username || '',
          email: updatedUser.email || '',
        });
        setProfilePhoto(avatarUrl);
        setProfilePhotoFile(null);
        setIsEditing(false);
        window.dispatchEvent(new Event('user-updated'));

        // Reload backend canonical profile to guard against partial updates
        const meRes = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
        if (meRes.ok) {
          const mePayload = await meRes.json();
          const canonicalUser = {
            ...updatedUser,
            ...mePayload,
            avatar_url: avatarUrl,
            username: mePayload.username || updatedUser.username,
            first_name: mePayload.first_name ?? updatedUser.first_name,
            last_name: mePayload.last_name ?? updatedUser.last_name,
          };
          localStorage.setItem('user', JSON.stringify(canonicalUser));
          onProfileUpdated(canonicalUser);
          setProfileData({
            displayName: `${canonicalUser.first_name || ''} ${canonicalUser.last_name || ''}`.trim() || canonicalUser.username || 'User',
            username: canonicalUser.username || '',
            email: canonicalUser.email || '',
          });
          setProfilePhoto(canonicalUser.avatar_url || avatarUrl);
          window.dispatchEvent(new Event('user-updated'));
        }
      }
    } catch (err) {
      setProfileError('Network error saving profile');
    }

    setProfileSaving(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert("Failed to delete account"); }
      else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch { alert("Error deleting account"); }
    setDeleteLoading(false);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={value}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${value ? "bg-[#5555ee]" : "bg-gray-200"}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Settings</h2>
      <div className="bg-white rounded-2xl p-5 mb-4">
        <h3 className="font-semibold text-gray-700 text-sm mb-4">Profile</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-col items-center gap-2">
            <img src={profilePhoto} alt="me" className="w-14 h-14 rounded-full object-cover" />
            {isEditing && (
              <label className="cursor-pointer text-xs font-semibold text-[#5555ee] hover:text-[#4444cc] transition-colors">
                Change photo
                <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="hidden" />
              </label>
            )}
          </div>
          <div>
            {isEditing ? (
              <input
                value={profileData.displayName}
                onChange={e => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                className="text-gray-800 text-base font-semibold bg-gray-100 rounded-md px-2 py-1 border border-gray-200"
              />
            ) : (
              <p className="font-semibold text-gray-800">{profileData.displayName || 'User'}</p>
            )}
            <p className="text-sm text-gray-400">Basic Member</p>
          </div>
          <button
            onClick={() => { if (isEditing) handleSaveProfile(); else setIsEditing(true); }}
            className="ml-auto text-[#5555ee] text-sm font-semibold"
            disabled={profileSaving}
          >
            {isEditing ? (profileSaving ? 'Saving...' : 'Save') : 'Edit'}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                setProfileData({
                  displayName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '',
                  username: user.username || '',
                  email: user.email || '',
                });
                setProfilePhoto(user.avatar_url || "https://i.pravatar.cc/56?img=30");
                setProfilePhotoFile(null);
                setIsEditing(false);
                setProfileError('');
              }}
              className="text-sm text-red-500 font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
        <div className="space-y-3">
          {[
            ['Display name', profileData.displayName],
            ['Username', profileData.username],
            ['Email', profileData.email],
          ].map(([label, val]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">{label}</span>
              {isEditing ? (
                <input
                  value={val}
                  onChange={e => setProfileData(prev => ({ ...prev, [label === 'Display name' ? 'displayName' : label.toLowerCase()]: e.target.value }))}
                  className="text-sm text-gray-800 font-medium bg-gray-100 rounded-md px-2 py-1 border border-gray-200"
                />
              ) : (
                <span className="text-sm text-gray-800 font-medium">{val}</span>
              )}
            </div>
          ))}
        </div>
        {profileError && <p className="text-sm text-red-500 mt-2">{profileError}</p>}
      </div>
      <div className="bg-white rounded-2xl p-5 mb-4">
        <h3 className="font-semibold text-gray-700 text-sm mb-4">Preferences</h3>
        <div className="space-y-4">
          {[
            { label: "Push notifications", sub: "Receive alerts for likes and comments", value: notifications, toggle: () => setNotifications(v => !v) },
            { label: "Private account", sub: "Only followers can see your posts", value: privateAccount, toggle: () => setPrivateAccount(v => !v) },
            { label: "Email updates", sub: "Weekly digest of your activity", value: emailUpdates, toggle: () => setEmailUpdates(v => !v) },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-400">{item.sub}</p>
              </div>
              <Toggle value={item.value} onChange={item.toggle} />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5">
        <h3 className="font-semibold text-gray-700 text-sm mb-4">Account</h3>
        <button onClick={onLogout} className="w-full text-left py-2 text-sm text-blue-500 font-medium hover:text-blue-600 transition-colors mb-3">Logout</button>
        <button onClick={() => setShowDeleteConfirm(true)} className="w-full text-left py-2 text-sm text-red-500 font-medium hover:text-red-600 transition-colors">Delete account</button>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Account?</h3>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading} className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors">
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "How do I reset my password?", a: "Go to Settings → Account → Change Password. You'll receive a reset link via email." },
    { q: "Can I make my account private?", a: "Yes! Go to Settings → Preferences → toggle 'Private account' on." },
    { q: "How do I report a post?", a: "Tap the ··· menu on any post and select 'Report'. Our team reviews reports within 24 hours." },
    { q: "How do I delete a post?", a: "Tap the ··· menu on your own post and select 'Delete'. This action cannot be undone." },
    { q: "What is Connexio Pro?", a: "Pro unlocks priority ranking, analytics, a verified badge, and advanced privacy controls for $9.99/month." },
  ];
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1">Help & Support</h2>
      <p className="text-sm text-gray-400 mb-6">Find answers or reach out to us</p>
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 mb-6 border border-gray-100">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input placeholder="Search help articles..." className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none" />
      </div>
      <div className="bg-white rounded-2xl overflow-hidden mb-4">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-5 pt-4 pb-2">Frequently asked</p>
        {faqs.map((faq, i) => (
          <div key={i} className="border-t border-gray-50">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
              <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openFaq === i && <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact us</p>
        <a href="mailto:support@connexio.app" className="flex items-center gap-3 py-2 group">
          <div className="w-9 h-9 bg-[#5555ee]/10 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-[#5555ee]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Email support</p>
            <p className="text-sm text-[#5555ee]">support@connexio.app</p>
          </div>
        </a>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [currentUserId, setCurrentUserId] = useState("");
  const [activeNav, setActiveNav] = useState("Feed");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [newPostError, setNewPostError] = useState("");
  const [currentUserAvatar, setCurrentUserAvatar] = useState("https://i.pravatar.cc/40?img=30");
  const [currentUserName, setCurrentUserName] = useState("User");
  const [currentUserUsername, setCurrentUserUsername] = useState("@user");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<ProfileDetails | null>(null);
  const [selectedProfilePosts, setSelectedProfilePosts] = useState<Post[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const router = useRouter();
  const followingCount = friends.filter(friend => friend.added).length;

  const getToken = () => localStorage.getItem("token");

  const syncCurrentUser = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUserAvatar(storedUser.avatar_url || "https://i.pravatar.cc/40?img=30");
    setCurrentUserName(
      `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() || storedUser.username || "User"
    );
    setCurrentUserUsername(storedUser.username ? `@${storedUser.username}` : "@user");
    if (storedUser?.id) setCurrentUserId(storedUser.id);
  };

  const applyCurrentUser = (user: { id?: string; username?: string; first_name?: string; last_name?: string; avatar_url?: string }) => {
    setCurrentUserAvatar(user.avatar_url || "https://i.pravatar.cc/40?img=30");
    setCurrentUserName(
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "User"
    );
    setCurrentUserUsername(user.username ? `@${user.username}` : "@user");
    if (user.id) setCurrentUserId(user.id);
  };

  const syncFriends = async (userId: string, token: string) => {
    const [usersRes, followingRes] = await Promise.all([
      fetch("/api/users"),
      fetch(`/api/users/${userId}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const usersData: SearchUser[] | { error?: string } = await usersRes.json();
    const followingData: Array<{ id: string; username: string; avatar_url?: string }> | { error?: string } = await followingRes.json();

    if (!usersRes.ok || !Array.isArray(usersData)) return;

    const followingIds = new Set(Array.isArray(followingData) ? followingData.map(user => user.id) : []);
    const mappedFriends = usersData
      .filter(user => user.id !== userId)
      .map(user => ({
        id: user.id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username,
        handle: `@${user.username}`,
        avatar: user.avatar_url || "https://i.pravatar.cc/36",
        added: followingIds.has(user.id),
      }))
      .sort((a, b) => Number(b.added) - Number(a.added) || a.name.localeCompare(b.name));

    setFriends(mappedFriends);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    syncCurrentUser();
    Promise.all([
      fetch("/api/feed", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(async ([feedData, meData]) => {
      if (feedData.data) {
        setPosts(feedData.data.map((p: any) => ({
          id: p.id,
          author: {
            id: p.author?.id,
            username: p.author?.username,
            name: p.author?.username || "User",
            role: "Member",
            avatar: p.author?.avatar_url || "https://i.pravatar.cc/40",
          },
          content: p.content,
          hashtags: [],
          image: p.image_url || undefined,
          likes: p.like_count,
          comments: p.comment_count,
          shares: 0,
          saved: 0,
          liked: false,
          commentText: "",
        })));
      }

      if (meData?.id) {
        setCurrentUserId(meData.id);
        await syncFriends(meData.id, token);
      } else if (storedUser?.id) {
        await syncFriends(storedUser.id, token);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("user-updated", syncCurrentUser);
    return () => window.removeEventListener("user-updated", syncCurrentUser);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchError("");
      setSearchLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      try {
        const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
        const data: SearchUser[] | { error?: string } = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          setSearchError(Array.isArray(data) ? "Unable to search users" : (data.error || "Unable to search users"));
          setSearchResults([]);
          return;
        }

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const results = data.filter(user => user.id !== currentUser.id);

        setSearchResults(results);
      } catch {
        setSearchError("Unable to search users right now");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedStory) {
      setStoryProgress(0);
      return;
    }

    const animationDuration = 5000; // 5 seconds
    const startTime = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / animationDuration) * 100, 100);
      setStoryProgress(progress);

      if (progress >= 100) {
        setSelectedStory(null);
        setStoryProgress(0);
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [selectedStory]);

  const handleLike = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const method = post.liked ? "DELETE" : "POST";
    await fetch(`/api/posts/${id}/like`, {
      method,
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handleComment = (id: string, text: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, commentText: text } : p));
  };

  const submitComment = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post?.commentText.trim()) return;
    await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ content: post.commentText }),
    });
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, comments: p.comments + 1, commentText: "" } : p
    ));
  };

  const handleAddFriend = async (id: string) => {
    const token = getToken();
    if (!token) return;

    const existing = friends.find(f => f.id === id);
    if (!existing) return;

    const nextAdded = !existing.added;
    setFriends(prev => prev.map(f => f.id === id ? { ...f, added: nextAdded } : f));

    const res = await fetch(`/api/users/${id}/follow`, {
      method: nextAdded ? "POST" : "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setFriends(prev => prev.map(f => f.id === id ? { ...f, added: existing.added } : f));
      return;
    }

    if (currentUserId) {
      await syncFriends(currentUserId, token);
    }
  };

  const handleOpenStory = (story: Story) => {
    setSelectedStory(story);
  };

  const handleOpenProfile = async (user: { id: string; username: string; first_name?: string; last_name?: string; avatar_url?: string }) => {
    setProfileLoading(true);
    setActiveNav("Profile");
    setSelectedProfile({
      ...user,
      bio: "",
      posts_count: 0,
      followers_count: 0,
      following_count: 0,
    });
    setSelectedProfilePosts([]);
    setSearchQuery("");
    setSearchResults([]);

    try {
      const profilePromise = fetch(`/api/users/${user.id}`)
        .then(async res => (res.ok ? res.json() : null))
        .catch(() => null);

      const postsPromise = fetch(`/api/posts?author_id=${encodeURIComponent(user.id)}`)
        .then(async res => {
          if (!res.ok) return [];
          const data = await res.json();
          return data.data || [];
        })
        .catch(() => []);

      const followersPromise = fetch(`/api/users/${user.id}/followers`)
        .then(async res => (res.ok ? res.json() : []))
        .catch(() => []);

      const followingPromise = fetch(`/api/users/${user.id}/following`)
        .then(async res => (res.ok ? res.json() : []))
        .catch(() => []);

      const [profileData, postsData, followersData, followingData] = await Promise.all([
        profilePromise,
        postsPromise,
        followersPromise,
        followingPromise,
      ]);

      setSelectedProfile(prev => ({
        ...(prev || { ...user }),
        ...(profileData || {}),
        followers_count: Array.isArray(followersData) ? followersData.length : 0,
        following_count: Array.isArray(followingData) ? followingData.length : 0,
      }));

      setSelectedProfilePosts(postsData.map((p: any) => ({
        id: p.id,
        author: {
          id: p.author?.id,
          username: p.author?.username,
          name: p.author?.username || user.username,
          role: "Member",
          avatar: p.author?.avatar_url || user.avatar_url || "https://i.pravatar.cc/40",
        },
        content: p.content,
        hashtags: [],
        image: p.image_url || undefined,
        likes: p.like_count ?? 0,
        comments: p.comment_count ?? 0,
        shares: 0,
        saved: 0,
        liked: false,
        commentText: "",
      })));
    } catch {
      setSelectedProfilePosts([]);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleNewPost = async () => {
    setNewPostError("");

    if (!newPostText.trim() && !newPostImage) {
      setNewPostError('Post text or image is required');
      return;
    }

    const formData = new FormData();
    formData.append('content', newPostText.trim());
    if (newPostImage) {
      if (!['image/jpeg', 'image/png'].includes(newPostImage.type)) {
        setNewPostError('Only JPEG/PNG allowed');
        return;
      }
      if (newPostImage.size > 2 * 1024 * 1024) {
        setNewPostError('Max image size is 2MB');
        return;
      }
      formData.append('image', newPostImage);
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setNewPostError(data.error || 'Could not create post');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const p: Post = {
      id: data.id,
      author: { name: `${user.first_name || user.username}`, role: 'Member', avatar: user.avatar_url || 'https://i.pravatar.cc/40?img=30' },
      content: newPostText.trim(),
      hashtags: [],
      image: data.image_url || undefined,
      likes: 0, comments: 0, shares: 0, saved: 0,
      liked: false, commentText: '',
    };

    setPosts(prev => [p, ...prev]);
    setNewPostText('');
    setNewPostImage(null);
    setShowNewPost(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) await fetch("/api/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const primaryMobileNavItems = NAV_ITEMS.filter(item =>
    ["Feed", "Stories", "Friends", "Settings"].includes(item.label)
  );

  const renderFriendSuggestions = (className: string) => (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 text-sm">Friend Suggestions</h3>
        <button onClick={() => setActiveNav("Friends")} className="flex items-center gap-1 text-[#5555ee] text-sm font-semibold hover:underline">
          See All
        </button>
      </div>
      <div className="space-y-3">
        {friends.filter(f => !f.added).map(f => (
          <div key={f.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img src={f.avatar} alt={f.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-gray-800 text-sm font-semibold leading-tight">{f.name}</p>
                <p className="truncate text-gray-400 text-[10px]">{f.handle}</p>
              </div>
            </div>
            <button
              onClick={() => handleAddFriend(f.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${f.added ? "bg-[#5555ee] border-[#5555ee] text-white" : "border-gray-200 text-gray-400 hover:border-[#5555ee] hover:text-[#5555ee]"}`}
            >
              {f.added ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeNav) {
      case "Stories": return <StoriesPage onOpenStory={handleOpenStory} />;
      case "Friends": return <FriendsPage friends={friends} onAdd={handleAddFriend} />;
      case "Profile": return <UserProfilePage profile={selectedProfile} posts={selectedProfilePosts} loading={profileLoading} onBack={() => setActiveNav("Feed")} />;
      case "Subscription": return <SubscriptionPage />;
      case "Settings": return <SettingsPage onLogout={handleLogout} onProfileUpdated={applyCurrentUser} />;
      case "Help & Support": return <HelpPage />;
      default: return (
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4 sm:px-6 lg:pb-4">
          {showNewPost && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg p-4 shadow-2xl sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800 text-lg">New Post</h2>
                  <button onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <img src={currentUserAvatar} alt="me" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <textarea
                    value={newPostText}
                    onChange={e => setNewPostText(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={4}
                    maxLength={280}
                    className="flex-1 resize-none outline-none text-gray-700 text-sm placeholder-gray-400 border border-gray-200 rounded-xl p-3"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm text-gray-500 mb-1">Attach image (JPEG/PNG, max 2MB)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={e => {
                      setNewPostError("");
                      const file = e.target.files?.[0] ?? null;
                      if (!file) { setNewPostImage(null); return; }
                      if (!['image/jpeg', 'image/png'].includes(file.type)) {
                        setNewPostError('Only JPEG/PNG allowed');
                        setNewPostImage(null);
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        setNewPostError('Max image size is 2MB');
                        setNewPostImage(null);
                        return;
                      }
                      setNewPostImage(file);
                    }}
                    className="block w-full text-sm text-gray-700"
                  />
                </div>
                {newPostError && <p className="text-xs text-red-500 mt-1">{newPostError}</p>}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-400">{newPostText.length}/280</span>
                  <button onClick={handleNewPost} disabled={!newPostText.trim()} className="bg-[#5555ee] hover:bg-[#4444cc] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">Post</button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4">
            <div className="flex gap-4 overflow-x-auto pb-1">
              {STORIES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleOpenStory(s)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-[#5555ee] to-purple-400">
                    <img src={s.avatar} alt={s.handle} className="w-full h-full rounded-full object-cover border-2 border-white" />
                  </div>
                  <span className="text-[10px] text-gray-500 group-hover:text-[#5555ee] transition-colors truncate max-w-[56px]">{s.handle}</span>
                </button>
              ))}
            </div>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-semibold">No posts yet</p>
              <p className="text-sm">Be the first to post something!</p>
            </div>
          )}

          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!post.author.id || !post.author.username) return;
                    handleOpenProfile({
                      id: post.author.id,
                      username: post.author.username,
                      avatar_url: post.author.avatar,
                    });
                  }}
                  className="flex items-center gap-3 text-left"
                >
                  <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{post.author.name}</p>
                    <p className="text-gray-400 text-sm">{post.author.role}</p>
                  </div>
                </button>
              </div>
              <div className="px-4 pb-3">
                <p className="text-gray-600 text-sm leading-relaxed">{post.content}</p>
              </div>
              {post.image && (
                <div className="mx-4 mb-3 rounded-xl overflow-hidden">
                  <img src={post.image} alt="post" className="w-full h-56 object-cover" />
                </div>
              )}
              <div className="px-4 pb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 border-b border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${post.liked ? "text-[#5555ee]" : "hover:text-[#5555ee]"}`}
                >
                  <svg className="w-4 h-4" fill={post.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {post.likes} Likes
                </button>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comments} Comments
                </span>
              </div>
              <div className="px-4 py-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <img src={currentUserAvatar} alt="me" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                  <input
                    value={post.commentText}
                    onChange={e => handleComment(post.id, e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submitComment(post.id)}
                    placeholder="Write your comment..."
                    className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                  />
                  <button
                    onClick={() => submitComment(post.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${post.commentText.trim() ? "bg-[#5555ee] text-white" : "bg-gray-300 text-gray-400"}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {activeNav === "Feed" && renderFriendSuggestions("rounded-2xl bg-white p-4 xl:hidden")}
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#eef0f8] text-base lg:h-screen lg:flex-row lg:overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}>
      <aside className="hidden h-full w-56 flex-shrink-0 flex-col bg-[#4444cc] lg:flex">
        <div className="px-5 py-5 flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#4444cc] font-black text-sm">c</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Connexio</span>
        </div>
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-white/50 text-sm">Search</span>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left group ${activeNav === item.label ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {(item.label === "Friends" ? followingCount : 0) > 0 && (
                <span className="bg-white text-[#4444cc] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.label === "Friends" ? followingCount : 0}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 py-3">
          <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2.5 transition-colors">
            <span className="text-white text-sm font-semibold">Go Pro</span>
            <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={currentUserAvatar} alt="me" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <p className="text-white text-sm font-semibold leading-tight">{currentUserName}</p>
              <p className="text-white/50 text-[10px]">{currentUserUsername}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-white/50 hover:text-white transition-colors" title="Logout">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        <header className="flex-shrink-0 border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4444cc]">
                <span className="text-sm font-black text-white">c</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Connexio</p>
                <p className="text-xs text-gray-400">{activeNav}</p>
              </div>
            </div>
            <button
              onClick={() => { setActiveNav("Feed"); setShowNewPost(true); }}
              className="flex items-center gap-2 rounded-xl bg-[#5555ee] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4444cc]"
            >
              Post
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-sm font-bold">+</span>
            </button>
          </div>
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search accounts"
                className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none flex-1"
              />
            </div>
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                {searchLoading ? (
                  <div className="px-4 py-4 text-sm text-gray-400">Searching accounts...</div>
                ) : searchError ? (
                  <div className="px-4 py-4 text-sm text-red-500">{searchError}</div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-gray-400">No accounts found</div>
                ) : (
                  searchResults.slice(0, 6).map(user => {
                    const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username;
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleOpenProfile(user)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                      >
                        <img
                          src={user.avatar_url || "https://i.pravatar.cc/40"}
                          alt={user.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">{name}</p>
                          <p className="truncate text-xs text-gray-400">@{user.username}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
          <button
            onClick={() => { setActiveNav("Feed"); setShowNewPost(true); }}
            className="hidden items-center gap-2 rounded-xl bg-[#5555ee] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4444cc] sm:flex"
          >
            Add New Post
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-sm font-bold">+</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={currentUserAvatar} alt="me" className="w-9 h-9 rounded-full object-cover" />
            <button onClick={() => setActiveNav("Settings")} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          </div>
          </div>
        </header>
        <div className="border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeNav === item.label ? "bg-[#5555ee] text-white" : "bg-[#eef0f8] text-gray-500"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderSection()}
        </div>
      </main>

      {activeNav === "Feed" && renderFriendSuggestions("hidden w-64 flex-shrink-0 overflow-y-auto border-l border-gray-100 bg-white p-4 xl:block")}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2">
          {primaryMobileNavItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition-colors ${activeNav === item.label ? "bg-[#eef0ff] text-[#5555ee]" : "text-gray-500"}`}
            >
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute left-4 right-4 top-4 z-10 h-1 rounded-full bg-white/25">
              <div 
                className="h-full rounded-full bg-white transition-all duration-100 ease-linear" 
                style={{ width: `${storyProgress}%` }}
              />
            </div>
            <div className="relative h-[70vh] min-h-[420px] bg-gradient-to-b from-slate-800 via-slate-900 to-black sm:min-h-[520px]">
              <img src={selectedStory.avatar} alt={selectedStory.handle} className="h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/35" />
              <div className="absolute left-0 right-0 top-8 flex items-center gap-3 px-5">
                <img src={selectedStory.avatar} alt={selectedStory.handle} className="h-11 w-11 rounded-full border-2 border-white/80 object-cover" />
                <div>
                  <p className="text-sm font-semibold text-white">{selectedStory.handle}</p>
                  <p className="text-xs text-white/70">Posted 2h ago</p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-2xl font-bold leading-tight text-white">Status update from {selectedStory.handle}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/80">Sharing a quick moment with friends. Tap another story to keep watching.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
