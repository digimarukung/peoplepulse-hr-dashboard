import './style.css'

const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
const series = {
  '2026': { staff: [184,188,192,195,201,205,211,215,218,224,229,236], hires:[12,18,16,22,19,24,25,22,28,30,26,31], leaves:[5,6,7,5,8,6,9,8,7,9,8,10] },
  '2025': { staff: [158,160,164,168,171,175,178,181,184,187,190,194], hires:[10,13,12,17,14,18,17,15,19,21,20,23], leaves:[4,5,5,4,6,5,6,7,5,7,6,8] },
  '2024': { staff: [141,143,145,148,151,153,156,158,160,163,166,170], hires:[8,10,11,13,12,14,15,13,16,17,15,19], leaves:[3,4,4,3,5,4,5,4,5,5,6,6] },
}
let year = '2026'
const chart = (h:number[], l:number[]) => {
  const width=640, height=190, left=36, right=10, top=10, bottom=24, max=36
  const x=(i:number)=>left+i*(width-left-right)/11, y=(v:number)=>top+(max-v)*(height-top-bottom)/max
  const path=(values:number[])=>values.map((v,i)=>`${i?'L':'M'} ${x(i)} ${y(v)}`).join(' ')
  const area=`${path(h)} L ${x(11)} ${height-bottom} L ${x(0)} ${height-bottom} Z`
  const grid=[0,10,20,30].map(n=>`<line class="grid-line" x1="${left}" x2="${width-right}" y1="${y(n)}" y2="${y(n)}"/><text class="axis-text" x="2" y="${y(n)+3}">${n}</text>`).join('')
  const labels=months.map((m,i)=>`<text class="axis-text" text-anchor="middle" x="${x(i)}" y="${height-4}">${m}</text>`).join('')
  return `<svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="กราฟจำนวนพนักงานเข้าและออก"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4e6fea" stop-opacity=".18"/><stop offset="1" stop-color="#4e6fea" stop-opacity="0"/></linearGradient></defs>${grid}<path class="area" d="${area}"/><path class="line-a" d="${path(h)}"/><path class="line-b" d="${path(l)}"/>${h.map((v,i)=>i===h.length-1?`<circle class="point" cx="${x(i)}" cy="${y(v)}" r="4"/>`: '').join('')}${labels}</svg>`
}

const app=document.querySelector<HTMLDivElement>('#app')!
function render(){
  const data=series[year as keyof typeof series]
  const current=data.staff[11], previous=data.staff[10], delta=current-previous
  const departments=[['เทคโนโลยี',38],['ฝ่ายขาย',27],['การตลาด',21],['ปฏิบัติการ',18],['ทรัพยากรบุคคล',12]]
  app.innerHTML=`<div class="shell">
    <aside class="sidebar"><div class="brand"><div class="brandmark">P</div>PeoplePulse</div>
      <div class="workspace"><span class="dot"></span><div><strong>Demo workspace</strong><small>ข้อมูลจำลอง · ไม่ใช่ข้อมูลจริง</small></div></div>
      <div class="nav-label">WORKSPACE</div><nav class="nav">
        <button class="active"><span>▦</span>ภาพรวม</button><button><span>♙</span>พนักงาน</button><button><span>◷</span>เวลาและการลา</button><button><span>✧</span>การสรรหา</button><button><span>▤</span>รายงาน</button>
      </nav><div class="nav-label" style="margin-top:28px">MANAGE</div><nav class="nav"><button><span>⚙</span>ตั้งค่า</button><button><span>?</span>ช่วยเหลือ</button></nav>
      <div class="side-bottom"><div class="avatar">PP</div><div><b>Demo Admin</b><small>ตัวอย่างระบบ HR</small></div></div>
    </aside>
    <main class="main"><header class="topbar"><div class="crumb"><span class="mobile-menu">☰　</span>หน้าหลัก　/　<b>ภาพรวมบุคลากร</b></div><div class="top-actions"><button class="icon-btn" id="notify">♧　แจ้งเตือน</button><div class="profile-dot">PP</div></div></header>
      <div class="content"><div class="heading-row"><div><div class="eyebrow">PEOPLE ANALYTICS</div><h1>ภาพรวมบุคลากร</h1><p>ติดตามภาพรวมทีมและแนวโน้มกำลังคนในที่เดียว</p></div><div class="filter-wrap"><label for="year">ปีรายงาน</label><select id="year"><option value="2026" ${year==='2026'?'selected':''}>พ.ศ. 2569</option><option value="2025" ${year==='2025'?'selected':''}>พ.ศ. 2568</option><option value="2024" ${year==='2024'?'selected':''}>พ.ศ. 2567</option></select><button class="button-primary" id="export">⇩　ส่งออกรายงาน</button></div></div>
        <section class="kpis">
          <article class="card kpi"><div class="kpi-top">พนักงานทั้งหมด <span class="kpi-icon">♙</span></div><div class="kpi-value">${current.toLocaleString()}</div><div class="kpi-foot"><span class="up">▲ ${delta} คน</span> จากเดือนก่อน</div></article>
          <article class="card kpi"><div class="kpi-top">พนักงานใหม่ปีนี้ <span class="kpi-icon">＋</span></div><div class="kpi-value">${data.hires.reduce((a,b)=>a+b,0)}</div><div class="kpi-foot"><span class="up">▲ 12.8%</span> เทียบปีก่อน</div></article>
          <article class="card kpi"><div class="kpi-top">อัตราการลาออก <span class="kpi-icon">↗</span></div><div class="kpi-value">4.2<span style="font-size:14px">%</span></div><div class="kpi-foot"><span class="down">▼ 0.6%</span> จากปีก่อน</div></article>
          <article class="card kpi"><div class="kpi-top">อัตราการเข้างาน <span class="kpi-icon">✓</span></div><div class="kpi-value">96.8<span style="font-size:14px">%</span></div><div class="kpi-foot"><span class="up">▲ 1.4%</span> จากเดือนก่อน</div></article>
        </section>
        <section class="grid-main"><article class="card chart-card"><div class="card-head"><div><h2>แนวโน้มกำลังคน</h2><p>จำนวนพนักงานเข้าใหม่และลาออก รายเดือน</p></div><div class="legend"><span><i></i>เข้าใหม่</span><span><i class="teal"></i>ลาออก</span></div></div>${chart(data.hires,data.leaves)}</article>
          <article class="card chart-card"><div class="card-head"><div><h2>พนักงานตามแผนก</h2><p>สัดส่วนทีม ณ เดือนธันวาคม ${Number(year)+543}</p></div><button class="period" id="deptDetail">ดูรายละเอียด　›</button></div><div class="dept-list">${departments.map(([name,count])=>`<div class="dept-row"><span>${name}</span><div class="track"><div class="fill" style="width:${Number(count)*2.3}%"></div></div><strong>${count}</strong></div>`).join('')}</div><div class="footnote">รวม ${current} คน　·　แสดงข้อมูลตัวอย่าง 5 แผนก</div></article></section>
        <section class="grid-bottom"><article class="card table-card"><div class="card-head"><div><h2>รายการล่าสุด</h2><p>ความเคลื่อนไหวของพนักงานในระบบ</p></div><button class="period" id="allActivity">ดูกิจกรรมทั้งหมด　›</button></div><div class="table-wrap"><table><thead><tr><th>พนักงาน</th><th>แผนก</th><th>รายการ</th><th>วันที่</th><th>สถานะ</th></tr></thead><tbody>
          <tr><td><div class="employee"><span class="mini">นช</span><b>นภัส ชัยวัฒน์</b></div></td><td>เทคโนโลยี</td><td>เริ่มงานใหม่</td><td>12 ธ.ค. 2569</td><td><span class="pill">สำเร็จ</span></td></tr>
          <tr><td><div class="employee"><span class="mini">พก</span><b>พิมพ์ชนก เกษมสุข</b></div></td><td>การตลาด</td><td>ลาพักร้อน</td><td>11 ธ.ค. 2569</td><td><span class="pill warn">รออนุมัติ</span></td></tr>
          <tr><td><div class="employee"><span class="mini">ธว</span><b>ธนวัฒน์ วงศ์ดี</b></div></td><td>ฝ่ายขาย</td><td>ปรับตำแหน่ง</td><td>10 ธ.ค. 2569</td><td><span class="pill">สำเร็จ</span></td></tr>
          <tr><td><div class="employee"><span class="mini">อร</span><b>อรทัย พูลผล</b></div></td><td>ปฏิบัติการ</td><td>ลาป่วย</td><td>9 ธ.ค. 2569</td><td><span class="pill">อนุมัติแล้ว</span></td></tr>
        </tbody></table></div><div class="footnote">ชื่อและรายการทั้งหมดเป็นข้อมูลสมมติสำหรับสาธิต</div></article>
          <article class="card attrition-card"><div class="card-head"><div><h2>สถานะกำลังคน</h2><p>สรุปสถานะพนักงานปัจจุบัน</p></div><button class="period" id="statusInfo">ปี ${Number(year)+543}　⌄</button></div><div class="ring-wrap"><div class="ring"><div class="ring-center"><b>${current}</b><small>คนทั้งหมด</small></div></div><div class="ring-legend"><div><i></i>ทำงานอยู่ <strong>41%</strong></div><div><i></i>ทดลองงาน <strong>28%</strong></div><div><i></i>ลางาน <strong>18%</strong></div><div><i></i>ตำแหน่งว่าง <strong>13%</strong></div></div></div><div class="footnote">ข้อมูลตัวอย่างเพื่อแสดงรูปแบบรายงาน</div></article></section>
      </div>
    </main>
  </div><div class="toast" id="toast">เตรียมรายงานตัวอย่างเรียบร้อยแล้ว</div>`
  document.querySelector<HTMLSelectElement>('#year')!.addEventListener('change',e=>{year=(e.target as HTMLSelectElement).value;render()})
  const toast=document.querySelector<HTMLDivElement>('#toast')!
  const notify=(message:string)=>{toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}
  document.querySelector('#export')?.addEventListener('click',()=>notify('เดโมนี้ยังไม่ได้เชื่อมระบบส่งออกไฟล์'))
  document.querySelector('#notify')?.addEventListener('click',()=>notify('ไม่มีการแจ้งเตือนใหม่'))
  document.querySelector('#deptDetail')?.addEventListener('click',()=>notify('กำลังแสดงข้อมูลตัวอย่าง 5 แผนก'))
  document.querySelector('#allActivity')?.addEventListener('click',()=>notify('นี่คือรายการกิจกรรมตัวอย่างล่าสุด'))
  document.querySelector('#statusInfo')?.addEventListener('click',()=>notify('สัดส่วนสถานะเป็นข้อมูลจำลอง'))
}
render()
