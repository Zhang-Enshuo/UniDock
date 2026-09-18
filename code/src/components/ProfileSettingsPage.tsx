import { useEffect, useState } from "react";
import { OverviewHeader } from "./OverviewHeader";
import type { Profile } from "../types";

const defaultProfile: Profile = {
  displayName: "Enzo",
  zId: "z5555555",
  program: "UNSW College Foundation",
  intake: "Term 1",
  studentEmail: "z5555555@ad.unsw.edu.au",
  campus: "Kensington",
  notes: "刚到校，优先关注日程、邮件和学生事务入口。",
};

function loadProfile() {
  try {
    const saved = localStorage.getItem("unidock-profile");
    return saved ? (JSON.parse(saved) as Profile) : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 1600);
    return () => window.clearTimeout(timer);
  }, [saved]);

  function updateProfile<Key extends keyof Profile>(key: Key, value: Profile[Key]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function saveProfile() {
    localStorage.setItem("unidock-profile", JSON.stringify(profile));
    setSaved(true);
  }

  return (
    <>
      <OverviewHeader kicker="Local settings" title="个人信息 / 设置" description="基础资料只保存在本地浏览器中，不会同步到云端。" />
      <section className="panel settings-page" aria-labelledby="profile-title">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Profile</p>
            <h2 id="profile-title">基础资料</h2>
          </div>
          <button className="action-btn" type="button" onClick={saveProfile}>保存到本地</button>
        </div>
        <p className="local-note">这些信息只保存在此浏览器中，不会同步到云端，也不会读取学校账号信息。</p>
        <div className="form-grid profile-grid">
          <label>
            <span>昵称或姓名</span>
            <input value={profile.displayName} onChange={(event) => updateProfile("displayName", event.target.value)} />
          </label>
          <label>
            <span>zID</span>
            <input value={profile.zId} onChange={(event) => updateProfile("zId", event.target.value)} />
          </label>
          <label>
            <span>Program / Course</span>
            <input value={profile.program} onChange={(event) => updateProfile("program", event.target.value)} />
          </label>
          <label>
            <span>Term / Intake</span>
            <input value={profile.intake} onChange={(event) => updateProfile("intake", event.target.value)} />
          </label>
          <label>
            <span>Student Email</span>
            <input value={profile.studentEmail} onChange={(event) => updateProfile("studentEmail", event.target.value)} />
          </label>
          <label>
            <span>Campus</span>
            <input value={profile.campus} onChange={(event) => updateProfile("campus", event.target.value)} />
          </label>
          <label className="span-2">
            <span>备注</span>
            <textarea value={profile.notes} onChange={(event) => updateProfile("notes", event.target.value)} />
          </label>
        </div>
        {saved ? <p className="save-note">已保存到本地浏览器。</p> : null}
      </section>
    </>
  );
}
