# EV Battery Pack Enclosure — 20-min Presentation Plan

Oct 26, 2026 · @nests

## Tổng quan: 20 slide, 20 phút, khoảng 2.600 từ script

Bài thuyết trình gồm 20 slide chia thành 6 phần, nói với tốc độ khoảng 130 từ/phút. Mỗi phần dưới đây có: **nội dung slide** (title, text, hình/sơ đồ, nguồn trích dẫn ghi ở chân slide) và **script tiếng Anh** để đọc. Số trong ngoặc vuông như \[7\] là số nguồn trong danh sách References ở cuối tài liệu, khớp với số nguồn trong báo cáo nghiên cứu của bạn.

**Phần 3 (Ranking) đặt ở vị trí thứ 3 có hợp lý không?** Có, và đây là thứ tự tốt nhất. Lý do:

1. Ranking cần **tiêu chí** (criteria) và **dữ liệu tính chất** (property data). Cả hai đều được giới thiệu ở Phần 2, nên khán giả đã có đủ kiến thức để hiểu bảng điểm.
2. Kết quả ranking là "không có vật liệu nào thắng tất cả", nên dẫn tự nhiên sang Phần 4: thiết kế đa vật liệu (multi-material), mỗi bộ phận dùng vật liệu phù hợp nhất.
3. Vật liệu đã chọn quyết định phương pháp sản xuất ở Phần 5 (nhôm → đùn ép + hàn ma sát khuấy).
4. Thứ tự này cũng khớp đúng thứ tự trong đề bài của giảng viên.

Mẹo: kết thúc Phần 3 bằng câu nối "No single winner, so the structure must put each material where it works best" để chuyển sang Phần 4.

| # | Phần | Slide | Thời gian | Thời điểm kết thúc |
| --- | --- | --- | --- | --- |
| 0 | Title + agenda | 1–2 | 0:45 | 0:45 |
| 1 | The battery pack enclosure: what it is, history, market | 3–5 | 3:30 | 4:15 |
| 2 | Design constraints: functions, tests, material properties | 6–9 | 4:30 | 8:45 |
| 3 | Ranking the materials | 10–12 | 3:30 | 12:15 |
| 4 | Structure design | 13–15 | 3:30 | 15:45 |
| 5 | Production method (overview + aluminium extrusion & FSW in detail) | 16–18 | 3:00 | 18:45 |
| 6 | Conclusion + references | 19–20 | 1:15 | 20:00 |

**Slide 1 – Title.** Title: *Building the Box That Guards EV Batteries: Material Selection for an EV Battery Pack Enclosure*. Subtitle: tên bạn, môn học, ngày. Hình nền: ảnh cắt lớp (cutaway) bộ pin dưới sàn xe, ví dụ ảnh Audi e-tron battery từ Audi Technology Portal \[7\].

**3D model (tùy chọn) – xe điện trong suốt:**

- Cảnh: một khung xe điện chung chung (không logo), thân xe dạng khung dây (wireframe) hoặc trong suốt khoảng 80%. Model A nằm phẳng dưới sàn giữa hai trục bánh, phát sáng nhẹ màu xanh dương.
- Chuyển động: camera quay chậm 360° quanh xe trong 8 giây, lặp lại; tiêu đề hiện đè lên.
- Chuyển cảnh Morph sang slide 2: camera zoom vào hộp pin.

> Script: "Good morning everyone. Every electric car carries a battery that costs about a third of the whole car. Today I want to talk about the box that protects it: the battery pack enclosure. I will show how engineers choose its material, design its structure, and manufacture it."

**Slide 2 – Agenda.** Danh sách 6 phần như ảnh bạn gửi: 1. The battery pack enclosure · 2. Design constraints · 3. Ranking the materials · 4. Structure design · 5. Production method · 6. Conclusion.

> Script: "My talk has six parts. First, what the enclosure is, where it came from, and why the market needs it. Second, the constraints a designer must meet. Third, I will rank the candidate materials. Fourth, the structure. Fifth, how it is made. And finally, my conclusion."

## Kế hoạch 3D model: 10 slide, dùng chung 1 mô hình gốc

Chỉ dùng 3D ở những slide nói về **hình dạng, cấu tạo không gian hoặc chuyển động** (cấu tạo hộp, va chạm, quy trình sản xuất). Slide biểu đồ và bảng số (5, 9, 10, 11, 12, 16, 18, 20) nên giữ 2D, vì biểu đồ 3D làm người xem đọc sai số liệu.

Cách làm tiết kiệm thời gian nhất: dựng **một mô hình gốc (Model A – hộp pin đa vật liệu)**, mỗi bộ phận là một object riêng có tên, rồi dùng lại cho slide 3, 6, 13, 15, 19. Các mô hình khác (B–E) nhỏ và đơn giản hơn.

| Slide | Mô hình 3D | Mục đích | Thời lượng | Ưu tiên |
| --- | --- | --- | --- | --- |
| 1 | Khung gầm xe điện trong suốt, hộp pin phát sáng | Gây ấn tượng mở đầu | 8 s lặp | Tùy chọn |
| 3 | Model A tách lớp + cell → module → pack | Hiểu chiếc hộp gồm những gì | 12 s | **Bắt buộc** |
| 4 | Model B: 4 hộp pin qua các thời kỳ | Thấy sự tiến hóa | 12 s | Nên có |
| 6 | Model A + 7 "mối đe dọa" động | 7 nhiệm vụ của hộp | 15 s | Tùy chọn |
| 7 | 3 máy thử nghiệm thu nhỏ | Hiểu bài test như thế nào | 12 s | Nên có |
| 8 | Model C: 3 tấm cùng độ cứng, khác khối lượng | Hiểu chỉ số E^(1/3)/ρ | 12 s | **Bắt buộc** |
| 13 | Model A, click từng bộ phận | Mỗi bộ phận một nhiệm vụ | 10 s | **Bắt buộc** |
| 14 | Model D: module → CTP → CTB (morph) | Hiểu mức tích hợp | 12 s | Nên có |
| 15 | Model A mặt cắt + va cột, va đáy, cháy 1 cell | Hiểu đường truyền lực và chặn lửa | 15 s | **Bắt buộc** |
| 17 | Model E: đùn ép + hàn ma sát khuấy | Hiểu quy trình sản xuất | 15 s | **Bắt buộc** |
| 19 | Model A hoàn chỉnh xoay chậm | Kết thúc ấn tượng | 8 s lặp | Tùy chọn |

**Quy tắc để 3D không làm hỏng bài 20 phút:**

1. Mỗi chuyển động ≤ 15 giây và chạy **trong lúc bạn đang nói** script, không dừng lại để chờ. Tổng thời gian 3D khoảng 2 phút, nằm trong 20 phút.
2. **Dùng chung một bảng màu** với hình 2D ở slide 15: nhôm = xanh dương, thép = xanh lá, composite SMC = xám xanh đậm, lớp chống cháy = hồng, va chạm/lửa = đỏ. Người xem sẽ nhận ra vật liệu qua màu ở mọi slide.
3. **Ghi chú độ chính xác:** mô hình chung chung ghi *"Illustrative model, not to scale"* ở góc slide. Chỉ những kích thước lấy từ nguồn (ghi trong mô tả từng slide) mới được nói là số thật. Không dùng logo hay mô hình xe của hãng cụ thể.
4. **Công cụ:** dựng mô hình bằng Blender (miễn phí) hoặc Spline (trên web, dễ hơn cho người mới), xuất file .glb. PowerPoint bản Microsoft 365 chèn được 3D model; nhân đôi slide, đổi góc xoay hoặc vị trí, rồi dùng chuyển cảnh **Morph** để có hiệu ứng xoay/tách lớp mượt. Google Slides không hỗ trợ 3D trực tiếp, nên khi đó hãy xuất video .mp4 từ Blender.
5. **Luôn có bản dự phòng:** xuất mỗi chuyển động ra video .mp4 và ảnh tĩnh, phòng khi máy tính ở lớp không chạy được 3D. Thử trên máy ở lớp trước buổi thuyết trình.

**Cấu tạo Model A (dùng chung):** hộp khoảng 1400 × 1200 × 200 mm, bằng kích thước hộp pin trong nghiên cứu của Li et al. \[5\]. Gồm 11 object đặt tên rõ ràng:

| Object | Hình dạng | Vật liệu / màu |
| --- | --- | --- |
| `Lid` | Tấm nắp phẳng, có gân tăng cứng (ribs) | SMC chống cháy – xám xanh đậm |
| `Barrier` | Lớp mỏng ngay dưới nắp | Mica / aerogel – hồng |
| `Seal` | Vòng keo chạy quanh mép khay | Xám đen |
| `Cells` | 2 khoang, mỗi khoang nhiều cell dạng tấm | Trắng xám |
| `CrossMember` | Dầm ngang ở giữa chia 2 khoang | Thép – xanh lá |
| `Sill_L`, `Sill_R` | Dầm hai bên, mặt cắt nhiều khoang rỗng | Thép dập nóng hoặc nhôm nhiều khoang – xanh lá |
| `Tray` | Sàn khay đùn ép, có kênh làm mát rỗng bên trong | Nhôm 6xxx – xanh dương |
| `Shield` | Tấm bảo vệ đáy dạng kẹp (2 lớp + lõi zigzag) | Kim loại – xám |
| `Vent` | Van tròn nhỏ ở mặt bên hoặc đáy | Kim loại – xám |
| `Coolant` | Ống/cổng nước làm mát ở một đầu khay | Xanh dương nhạt |

Mô tả chi tiết từng cảnh 3D nằm ngay dưới phần Visual của mỗi slide, đánh dấu **3D model**.

## Part 1 – The battery pack enclosure (slides 3–5, 3:30)

Phần này đi từ đơn giản đến chi tiết: enclosure là gì → nó tiến hóa thế nào → vì sao thị trường cần nó. Mục tiêu: khán giả hiểu "cái hộp" trước khi nghe về vật liệu.

### Slide 3 – What is a battery pack enclosure?

- **Title:** The enclosure: a strong, sealed, fire-resistant box under the car floor
- **Text on slide:**
  - Cell → module → pack: "the cells, modules, and housing together" \[1\]
  - Main parts: tray (bottom), lid (top), side frame, cross members, underbody plate, seal, pressure vent, cooling plates \[7\]\[8\]
  - Typical pack ≈ 500 kg, of which enclosure ≈ 100 kg (industry estimate) \[9\]; one real aluminium enclosure: 149.4 kg \[10\]
- **Visual:** sơ đồ 3 bậc bên trái (cell → module → pack), bên phải là ảnh exploded view (hình tách lớp) của pin Audi e-tron từ Audi Technology Portal \[7\], gắn nhãn 5 bộ phận: lid, tray, frame, cross member, underbody plate.
- **Footer sources:** \[1\] ICCT 2023 · \[7\] Audi Technology Portal · \[8\] Shaikh et al., arXiv 2309.00637 · \[9\] Stratview Research (market research) · \[10\] Zhang et al., WEVJ 2025

**3D model (bắt buộc) – Model A tách lớp:**

1. 0–3 s: Model A lắp hoàn chỉnh, nhìn chéo 3/4 từ trên xuống.
2. 3–8 s: tách lớp theo chiều thẳng đứng. `Lid` và `Barrier` bay lên, `Cells` nâng nhẹ, `Tray` giữ nguyên, `Shield` hạ xuống. Mỗi phần hiện nhãn tiếng Anh: lid, tray, side frame, cross member, underbody plate, seal, vent, cooling plate.
3. 8–12 s: khung nhỏ góc phải: một cell → nhiều cell gom thành module → module xếp vào pack, minh họa "cell → module → pack" \[1\].

- Ghi chú trên slide: *Illustrative model; box size 1400 × 1200 × 200 mm as studied in \[5\]*.
- Đồng bộ với script: khi nói "the bottom half is the tray…", bộ phận đó sáng lên.

> Script (≈150 words): "Let's start with the basics. An electric car stores its energy in hundreds or even thousands of small battery cells. In a classic design, cells are grouped into modules, and the modules, wiring, cooling and housing together form the battery pack. The enclosure is that housing. You can picture it as a very strong lunchbox bolted under the floor of the car. The bottom half is the tray, the top half is the lid, and a stiff frame runs around the edge. Inside, cross members divide the space and carry loads. Underneath, a plate protects against stones. A seal keeps water out, a vent lets gas escape, and cooling plates control temperature. This box is not light. An industry estimate says a typical pack weighs about 500 kilograms, and around 100 of those are the enclosure itself. So the enclosure is a big part of the problem, and also a big opportunity."

### Slide 4 – History: from luggage box to car floor

- **Title:** 130 years: the enclosure went from wooden box to load-bearing floor
- **Text on slide (timeline, 6 mốc):**
  - 1890s–1912: batteries carried as cargo; 1912 Detroit Electric used wooden battery boxes \[11\]\[12\]
  - 1990: California's zero-emission mandate; GM EV1 lead-acid pack 533 kg \[13\]; 1999 Toyota RAV4 EV pack "entirely beneath the cabin floor" \[16\]
  - 2009–2011: Chevrolet Volt T-shaped pack as "a key structural element" \[18\]; Tesla Model S pack "forms the floorpan" \[22\]
  - 2013–2014: Model S debris fires → titanium/aluminium underbody shield \[23\]
  - 2018–2020: aluminium crash-frame housings (Audi e-tron, VW MEB) \[7\]\[26\]
  - 2019–2022: module removed (CATL CTP, BYD Blade) and pack merges with body (BYD CTB) \[31\]\[32\]\[36\]
- **Visual:** đường thời gian nằm ngang, 6 điểm mốc, mỗi mốc có 1 ảnh nhỏ (Detroit Electric, EV1, Volt T-pack, Model S shield, Audi e-tron, BYD Blade). Xem hình mẫu timeline ngay dưới script slide 4.
- **Footer sources:** \[11\] US DOE · \[12\] VEVA · \[13\] WardsAuto · \[16\] Toyota UK · \[18\] WardsAuto 2009 · \[22\] Green Car Reports 2011 · \[23\] MIT Technology Review 2014 · \[26\] VW Group · \[31\] CATL via Kyodo · \[32\] Gasgoo · \[36\] Gasgoo

**3D model (nên có) – Model B, 4 hộp pin qua các thời kỳ:** 4 mô hình nhỏ đặt trên một trục thời gian, camera trượt từ trái sang phải trong khoảng 12 giây.

1. **1912 – hộp gỗ:** hộp gỗ có nắp, bên trong là các cell, đặt ở khoang trước và sau của một khung xe cổ đơn giản \[12\].
2. **2009 – pin hình chữ T:** phần thân dọc rộng khoảng 400 mm nằm trong đường hầm giữa xe, phần ngang khoảng 1600 × 900 mm dưới ghế sau, cao khoảng 300 mm (kích thước theo \[19\]).
3. **2011–2014 – pin phẳng dưới sàn:** tấm pin phẳng giữa hai trục. Sau đó một tấm chắn đáy trượt vào từ dưới, kèm nhãn *2014: titanium + aluminium shield* \[23\].
4. **2022 – cell-to-body:** nắp pin trùng với sàn xe, ray ghế bắt trực tiếp lên nắp \[36\].

- Ghi chú: *Illustrative models; only the T-pack dimensions are from \[19\]*.

> Script (≈170 words): "The enclosure has a surprisingly long history. Around 1900, electric cars were about a third of all vehicles in the US, but their batteries were simply cargo. A 1912 Detroit Electric kept them in wooden boxes. The modern story began in 1990, when California required carmakers to sell zero-emission cars. GM's EV1 carried a lead-acid pack of 533 kilograms, and Toyota's RAV4 EV put its pack entirely under the cabin floor. With lithium-ion batteries, the pack started to carry the car. The Chevrolet Volt used a T-shaped pack as a structural element, and Tesla's Model S made the pack the floor itself. But a flat floor pack has a weak point: the underside. In 2013, road debris pierced Model S packs and caused fires, so Tesla added a titanium and aluminium shield. After 2018, premium cars used aluminium crash frames. And since 2019, Chinese makers removed the module layer completely. In BYD's design, the lid of the battery is now the floor of the cabin."

&#91;embedded content: Slide 4 visual · history timeline, 7 milestones\]

Hình mẫu cho slide 4: có thể chụp lại hoặc vẽ lại theo bố cục nằm ngang, thêm ảnh nhỏ cạnh từng mốc.

### Slide 5 – Market today: why this box matters

- **Title:** 20 million boxes a year protect the car's most expensive part
- **Text on slide (4 con số lớn):**
  - **> 20 million** electric cars sold in 2025, one in four new cars; 23 million expected in 2026 \[2\]
  - **33%** of a battery-electric car's production cost is the battery \[1\]
  - **$99/kWh** average battery-electric car pack price in 2025 \[38\]
  - **0.47–1.17 kWh/100 km** saved for every 100 kg removed \[42\]
  - Enclosure market: USD 3.1–4.7 billion (2025); aluminium ≈ 47–49% share (market-research estimates) \[39\]\[40\]
- **Visual:** 4 ô số liệu lớn (big-number tiles) ở trên; bên dưới là biểu đồ cột ngang thị phần vật liệu theo Global Market Insights: aluminium 49.0%, steel 38.9%, composites 8.1% \[40\]. Ghi chú nhỏ: "market-research estimate".
- **Footer sources:** \[1\] ICCT 2023 · \[2\] IEA Global EV Outlook 2026 · \[38\] BloombergNEF 2025 · \[39\] IMARC · \[40\] Global Market Insights · \[42\] Del Pero et al., Machines 2020

> Script (≈150 words): "Why does the market need a better enclosure? Two numbers. First, volume: according to the IEA, more than 20 million electric cars were sold in 2025, one in four new cars. That means about 20 million enclosures every year. Second, value: the ICCT calculates that the battery is about one third of the production cost of a battery-electric car. So a relatively cheap box protects the most expensive part of the car. There is also a third number: weight. A peer-reviewed study found that every 100 kilograms removed saves about half to more than one kilowatt-hour per 100 kilometres. Lighter enclosures mean longer range. Market-research firms estimate this market at three to five billion US dollars, with aluminium as the leading material. These estimates differ, so I treat them as rough. But the message is clear: strong, safe and light, at a price for mass production. That is the challenge."

Câu nối sang Phần 2: *"So what exactly must this box do? That brings us to the design constraints."*

## Part 2 – Design constraints (slides 6–9, 4:30)

Phần dài nhất, vì nó cung cấp "nguyên liệu" cho Phần 3. Thứ tự: chiếc hộp phải làm gì (chức năng) → luật biến chức năng thành bài test có số → so sánh tính chất vật liệu.

### Slide 6 – Seven jobs in one box

- **Title:** The enclosure must do seven jobs at once
- **Text on slide (7 icon):**
  1. Crash protection: no crushing of cells \[10\]
  2. Underbody protection: stones, kerbs, bollards
  3. Sealing: water, dust, road salt out
  4. Thermal management: holds the cooling system; cells work best at about 20–40 °C \[9\]
  5. Thermal-runaway containment: stop cell-to-cell fire spread
  6. Electrical safety: high-voltage isolation and EMC
  7. Light, stiff, serviceable, recyclable
- **Central tension (hộp nhấn mạnh ở dưới):** *Strength for crash safety vs. lightness for range* \[10\]
- **Visual:** 7 biểu tượng (icon) xếp quanh một hình hộp pin ở giữa: cú đâm, hòn đá, giọt nước, nhiệt kế, ngọn lửa, tia sét, quả cân.
- **Footer sources:** \[9\] Stratview Research · \[10\] Zhang et al., World Electric Vehicle Journal 16(11):632, 2025

**3D model (tùy chọn) – Model A và 7 mối đe dọa:** Model A ở giữa slide, 7 hiệu ứng xuất hiện lần lượt theo lời nói, mỗi hiệu ứng khoảng 2 giây.

1. Một cột đỏ đâm từ bên hông → `Sill_L` sáng lên.
2. Một hòn đá bay lên từ dưới → `Shield` sáng lên.
3. Giọt nước rơi xuống → bị `Seal` chặn lại.
4. `Tray` đổi màu nhiệt từ cam sang xanh → nước trong `Coolant` chảy.
5. Một cell đỏ rực → `Barrier` sáng lên, lửa không lan sang cell bên cạnh.
6. Một tia sét nhỏ → biểu tượng cách điện hiện ra.
7. Hộp đặt lên cân, hiện *≈100 kg enclosure (industry estimate)* \[9\].

> Script (≈140 words): "In plain terms, the enclosure has seven jobs. First, in a crash it must not let anything crush the cells. Second, it sits under the car, so stones and kerbs hit it from below; that was the lesson of the Tesla fires. Third, it must be sealed, because water inside a high-voltage battery destroys insulation. Fourth, it holds the cooling system, since lithium-ion cells work best between about 20 and 40 degrees. Fifth, if one cell catches fire, the box must stop the fire from spreading. Sixth, it keeps high voltage away from the car body and controls electrical noise. And seventh, it must do all this while staying light, stiff and recyclable. Notice the conflict between the first and the last job: strength for safety pulls toward heavy material, while range pulls toward light material. This tension drives every decision in my talk."

### Slide 7 – Regulations turn jobs into pass/fail tests

- **Title:** Regulations put numbers on every job
- **Text on slide (bảng 5 dòng):**

| Job | Test | Pass criterion |
| --- | --- | --- |
| Crash | UN R100 crush | ≥100 kN, 75 mm platen \[45\]\[48\] |
| Underbody | GB 38031-2025 bottom impact | 30 mm impactor, 150 J, 3 hits, no fire, leak or rupture \[3\] |
| Cell fire | GB 38031-2025 thermal propagation | No fire or explosion for ≥2 h \[3\] |
| Outside fire | UN R100 external fire | 2 min direct LPG flame, no explosion \[45\]\[48\] |
| Electrical | UN R100 Annex 4B | Isolation ≥100 Ω/V after tests \[48\] |

- **Visual:** bảng trên, tô đậm dòng "No fire for 2 h" vì đây là thay đổi lớn nhất. Thêm dòng chú thích: *GB 38031-2025 applies to new type approvals from 1 July 2026* \[46\].
- **Footer sources:** \[3\] AVL white paper on GB 38031-2025 · \[45\] In Compliance Magazine · \[46\] CarNewsChina 2025 · \[48\] UN ECE Regulation No. 100, EUR-Lex

**3D model (nên có) – 3 máy thử nghiệm thu nhỏ:** chia slide thành 3 cột, mỗi cột một cảnh ngắn khoảng 4 giây.

1. **Crush:** một khối bán trụ bán kính 75 mm ép vào cạnh hộp, đồng hồ lực tăng lên "100 kN" \[45\]\[48\].
2. **Bottom impact:** đầu đập đường kính 30 mm đập vào đáy 3 lần, nhãn *150 J × 3, SOC ≥ 95%* \[3\].
3. **Thermal propagation:** một cell đỏ rực, các cell xung quanh giữ màu bình thường, đồng hồ chạy *0 → 2 h, no fire* \[3\].

- Ghi chú: *Simplified illustration of test principles, not the real test rig*.

> Script (≈150 words): "These jobs are not just ideas. Regulations turn them into tests with numbers. Europe and many other countries use UN Regulation 100, and China uses GB 38031. In the crush test, the pack must survive at least 100 kilonewtons, about the weight of ten tonnes. China's new bottom-impact test hits the underside three times with a 30 mm steel head at 150 joules, with the battery almost fully charged, and nothing may leak, rupture or burn. The biggest change is this one: from July 2026, China requires that when one cell goes into thermal runaway, there must be no fire or explosion for at least two hours. The old rule only required a five-minute warning. Since China makes about 80% of the world's battery cells, this rule effectively sets a global target. Its message for the enclosure is simple: the box must change from protecting the battery to containing the fire."

### Slide 8 – Mechanical properties: steel is strongest, light metals are stiffest per kilogram

- **Title:** Steel wins on strength; aluminium and magnesium win on stiffness per kilogram
- **Text on slide (bảng rút gọn, 5 vật liệu):**

| Material | Density (g/cm³) | E (GPa) | UTS (MPa) | Elongation (%) | Fatigue (MPa) | Panel index E^(1/3)/ρ |
| --- | --- | --- | --- | --- | --- | --- |
| Press-hardened steel 22MnB5 | \~7.9 | \~190 | 1300–1650 \[52\] | 3.5–6 \[52\] | — | \~0.73 |
| Aluminium 6082 | 2.7 | 69 | 140–340 \[53\] | 6.3–18 | 55–130 | 1.52 |
| Magnesium AM60B | 1.7 | 45 | 230 \[56\] | 11 | 96 | 2.10 |
| FR glass-fibre SMC | 1.71–1.89 | 16 | 146–180 \[57\] | — | — | 1.33–1.47 |
| CFRP laminate | \~1.55\* | — | \~740 \[58\] | — | — | \~2.4\* |

- **Dòng chú thích nhỏ dưới bảng:** *Metal values: MakeItFrom.com handbook aggregator (indicative); \* assumed density; index calculated from cited values.*
- **Visual:** bảng trên, tô màu ô mạnh nhất mỗi cột (UTS của thép, panel index của magie). Góc phải: hình nhỏ một tấm phẳng bị uốn, ghi *stiffness ∝ E·t³, mass ∝ ρ·t → best panel = highest E^(1/3)/ρ* \[50\].
- **Footer sources:** \[50\] Ansys Granta EduPack lecture unit (Ashby method) · \[52\] AHSS Insights · \[53\]\[56\] MakeItFrom.com · \[57\] IDI Composites datasheet · \[58\] Hexcel HexPly 8552 datasheet

**3D model (bắt buộc) – Model C, ba tấm cùng độ cứng:** đây là hình 3D giúp khán giả hiểu nhanh nhất câu "an aluminium floor weighs about half".

- Ba tấm phẳng cùng diện tích, đặt trên hai gối đỡ, cùng độ cứng uốn: thép dày **t**, nhôm dày **1.40 t**, magie dày **1.62 t**. Quy tắc tính: độ dày tỉ lệ với E^(−1/3), dùng E = 190 / 69 / 45 GPa.
- Chuyển động 1 (0–6 s): cùng một lực ấn xuống giữa mỗi tấm, cả ba tấm võng cùng một mức, hiện chữ *same deflection*.
- Chuyển động 2 (6–12 s): ba tấm đặt lên ba cái cân, hiện khối lượng tương đối: **thép 1.00, nhôm 0.48, magie 0.35** (khối lượng = ρ · t, với ρ = 7.9 / 2.7 / 1.7 g/cm³).
- Ghi chú trên slide: *Calculated from E and ρ in \[51\]\[53\]\[56\]; stiffness ∝ E·t³, mass ∝ ρ·t*. Các tỉ lệ này là phép tính của bạn từ số liệu đã trích dẫn, khớp với kết luận "aluminium ≈ 2×, magnesium ≈ 2.9× steel" trong báo cáo.

> Script (≈170 words): "Now the materials. I compare five families: steel, aluminium, magnesium, glass-fibre SMC and carbon fibre. Look first at tensile strength. Press-hardened steel reaches 1300 to 1650 megapascals, four to five times aluminium. That is why steel is used where nothing may push into the cells. But strength is not everything. A battery floor or lid is a flat panel that bends. For a panel, stiffness grows with the cube of thickness, and mass grows only with thickness. So a lighter material can simply be made a little thicker. Ashby's method captures this with the panel index, E to the power one-third divided by density. On this index, aluminium is about twice as good as steel, and magnesium almost three times. In other words, for the same stiffness, an aluminium floor weighs about half as much as a steel floor. Magnesium looks even better, but it is brittle, with low elongation and fatigue strength. So no single number decides the winner."

### Slide 9 – Thermal, electrical, corrosion, cost and carbon

- **Title:** Each material wins a different test
- **Text on slide (bảng định tính với số liệu chính):**

| Property | Steel | Aluminium | FR glass-fibre SMC | CFRP |
| --- | --- | --- | --- | --- |
| Melting starts (solidus) | 1430 °C \[51\] | 580–600 °C \[53\]\[54\] | Flame-retardant, UL 94 5VA \[57\] | Epoxy autoignites \~430 °C \[62\] |
| Thermal conductivity (W/m·K) | 53 \[51\] | 130–160 \[53\]\[54\] | <0.1 \[57\] | \~0.2 (matrix) \[62\] |
| Electrical conductivity (% IACS) | 6.9 \[51\] | 33–42 \[53\]\[54\] | Insulating, needs foil for EMC \[70\] | Partly conductive |
| Corrosion | Needs AlSi/Zn coating \[52\] | Road salt, galvanic risk with steel/CFRP \[73\]\[74\] | No galvanic couple | Drives galvanic attack on aluminium \[73\] |
| Cost per kg | ¥10–20 | ¥30–50 | ¥40–70 | ¥200–400 \[59\] |
| CO₂ per kg | 1.4 kg \[51\] | 8.3–9.12 kg; recycled Al 0.52 t/t \[6\]\[79\] | 3.09–3.83 kg \[6\] | High, recycling immature \[5\] |

- **Dòng chú thích:** *Optical properties (UV, colour) are not a selection criterion for a hidden underbody box → weight 0 in the ranking.*
- **Visual:** bảng trên; dùng màu xanh lá cho ô tốt nhất mỗi dòng, đỏ cho ô yếu nhất, để khán giả thấy ngay "mỗi vật liệu thắng một dòng khác nhau". Có thể thêm 1 ảnh minh họa thử nghiệm lửa.
- **Footer sources:** \[5\] Li et al., Sci. Rep. 2024 · \[6\] Fragiadaki et al., Batteries 2026 (preprint) · \[51\]\[53\]\[54\] MakeItFrom.com · \[52\] AHSS Insights · \[57\] IDI · \[59\] PMC12608331 (2025) · \[62\] MakeItFrom epoxy · \[70\] Envalior · \[73\] Jáquez-Muñoz et al., Front. Met. Alloys 2023 · \[74\] Finishing & Coating · \[79\] International Aluminium Institute

> Script (≈175 words): "When we look beyond strength, each material wins a different test. Fire: steel starts to melt only at about 1430 degrees, but aluminium at about 600 degrees, far below the 800 to 1200 degree flames of a battery fire. In an industry test, a thin aluminium sheet collapsed in 30 seconds, while a steel cover held for 20 minutes. Flame-retardant SMC also performs well here. Heat: the opposite story. Aluminium conducts heat about three times better than steel, which is perfect for cooling plates. Electricity: metals shield electrical noise naturally, while composites are insulators and need added foil. Corrosion: aluminium suffers from road salt and from contact with steel or carbon fibre. Cost: per kilogram, steel is cheapest and carbon fibre is ten times more expensive. Carbon footprint: primary aluminium emits a lot, but recycled aluminium emits about 95% less. Finally, optical properties do not matter for a box nobody sees. So we have a puzzle: no material wins every row. We need a systematic way to rank them."

## Part 3 – Ranking the materials (slides 10–12, 3:30)

Trình bày theo 3 bước: sàng lọc nhanh bằng chỉ số Ashby → kết quả của các nghiên cứu đã công bố → bảng điểm có trọng số của riêng bạn. Luôn nói rõ bảng điểm là **tổng hợp của bạn** (own synthesis), không phải kết quả công bố.

**Lưu ý sửa lỗi nhỏ trong báo cáo:** báo cáo ghi thứ tự "Mg (2.10) > CFRP (\~2.4)", nhưng 2.4 lớn hơn 2.10. Trên slide nên xếp theo số: CFRP \~2.4 (khối lượng riêng giả định) > Mg 2.10 > Al 1.52 > SMC 1.33–1.47 > stainless 0.75 ≈ steel 0.73.

### Slide 10 – Step 1: Ashby screen

- **Title:** Step 1 – The Ashby panel index screens for lightness at equal stiffness
- **Text on slide:**
  - Floor and lid = panel in bending → maximise **E^(1/3)/ρ** \[50\]
  - Result: CFRP \~2.4\* > magnesium 2.10 > aluminium 1.52 > FR SMC 1.33–1.47 > stainless 0.75 ≈ steel 0.73
  - Limit: the index ignores cost, fire, corrosion and carbon → we need more criteria
- **Visual:** biểu đồ cột ngang 6 vật liệu theo panel index (CFRP tô nét đứt vì mật độ giả định). Nếu muốn nâng cao: đặt thêm một biểu đồ Ashby (log E theo log ρ) với đường dẫn dốc 3 cho panel \[50\].
- **Footer sources:** \[50\] Ansys Granta EduPack lecture unit, citing Ashby, *Materials Selection in Mechanical Design*, 5th ed., 2016 · property data \[51\]\[53\]\[55\]\[56\]\[57\]\[58\] · \*assumed density 1.55 g/cm³

> Script (≈130 words): "How do we rank materials that each win a different test? Step one is a quick screen with Ashby's method. Because the floor and the lid are panels in bending, the index to maximise is E to the one-third over density. Carbon fibre and magnesium come out on top, aluminium is in the middle, and both steels come last. This tells us which materials give the lightest box for the same stiffness. But it tells us nothing about cost, fire, corrosion or carbon footprint. Magnesium, for example, has a great index but starts melting below 550 degrees. So Ashby is a good first filter, not the final answer. For the final answer, engineers use multi-criteria decision making. Before I show my own ranking, let me show what published studies found."

### Slide 11 – Step 2: What published studies found

- **Title:** Step 2 – Published studies agree: the winner depends on what you measure
- **Text on slide (bảng 3 nghiên cứu):**

| Study | Method | Ranking |
| --- | --- | --- |
| Gökciler & Geren, 2026 \[4\] | Exchange constants + penalty function | Mass + cost: Al > CFRP > stainless. Crash \~60 km/h: Al best; >100 km/h: CFRP best |
| Li et al., *Sci. Rep.* 2024 \[5\] | Life-cycle assessment, equal stiffness | Carbon vs steel: Al −44.4% > CF-SMC −34.6% > steel |
| Fragiadaki et al., *Batteries* 2026 \[6\] | Cradle-to-gate (factory gate) | Lightest: Al. Lowest CO₂/kg and cost: SMC |

- **Key message box:** *Different system boundaries give different winners: per kg at the factory gate, aluminium is penalised; over the whole life, aluminium wins* \[5\]\[6\]
- **Visual:** bảng trên với logo/bìa tạp chí nhỏ của mỗi bài báo (Scientific Reports, Batteries, IJASTECH).
- **Footer sources:** \[4\] Gökciler & Geren, Int. J. Automotive Sci. Technol. 10(1):64–75, 2026, DOI 10.30939/ijastech..1830219 · \[5\] Li et al., Sci. Rep. 14:2594, 2024, DOI 10.1038/s41598-024-53238-2 · \[6\] Fragiadaki, Vogiantzi & Tserpes, Batteries 12(9):318, 2026, preprint DOI 10.20944/preprints202607.2270.v1

> Script (≈150 words): "Three peer-reviewed studies are especially useful. Gökciler and Geren, 2026, compared stainless steel, aluminium and carbon fibre. When only mass and cost matter, aluminium wins. When crash energy is added, aluminium is best at around 60 kilometres per hour, but carbon fibre is better above 100. Li and colleagues, 2024, looked at carbon emissions over the whole life of a battery box with equal stiffness. Compared with steel, aluminium cut global warming impact by 44 percent, and carbon-fibre SMC by 35 percent. Fragiadaki and colleagues, 2026, only counted emissions up to the factory gate. There, aluminium was the lightest, but glass-fibre SMC had the lowest carbon per kilogram and the lowest cost. These results do not contradict each other. They measure different things. So every ranking must say clearly what it measures and how much each criterion matters."

### Slide 12 – Step 3: Weighted-score ranking (own synthesis)

- **Title:** Step 3 – My weighted ranking: steel wins on cost and fire, aluminium and CFRP win on range
- **Text on slide (2 bảng nhỏ):**

Trọng số (criteria and weights):

| Criterion | Cost & fire focus | Range focus |
| --- | --- | --- |
| Panel stiffness per kg | 20% | 30% |
| Strength / crash | 15% | 15% |
| Fire resistance | 15% | 10% |
| Cost | 20% | 10% |
| Fatigue & corrosion | 10% | 10% |
| EMI shielding | 5% | 5% |
| Thermal conductivity | 5% | 10% |
| CO₂ & recycling | 10% | 10% |
| Optical | 0% | 0% |

Kết quả (score out of 5):

| Material | Cost & fire focus | Range focus |
| --- | --- | --- |
| Press-hardened steel | **3.75 (1st)** | 3.25 (3rd) |
| Aluminium | 3.15 (2nd) | **3.30 (1st =)** |
| CFRP | 3.00 (3rd =) | **3.30 (1st =)** |
| FR glass-fibre SMC | 3.00 (3rd =) | 2.75 (5th) |
| Magnesium | 2.75 (5th =) | 3.10 (4th) |
| Stainless 304 | 2.75 (5th =) | 2.50 (6th) |

- **Dòng chú thích bắt buộc:** *Own synthesis. Scores 1–5 follow explicit rules from the cited property, cost and CO₂ data; missing data = neutral 3. Example: steel = 0.20×1 + 0.15×5 + 0.15×5 + 0.20×5 + 0.10×4 + 0.05×4 + 0.05×3 + 0.10×3 = 3.75*
- **Visual:** biểu đồ cột nhóm (grouped bar chart): 6 vật liệu, mỗi vật liệu 2 cột (2 kịch bản trọng số). Bảng trọng số đặt nhỏ bên phải. Bảng điểm chi tiết từng ô (scoring rules) để ở slide dự phòng (backup slide) để trả lời câu hỏi.
- **Footer sources:** scores based on \[4\]\[5\]\[6\]\[51\]–\[59\]\[64\]\[79\]; method: weighted-sum multi-criteria decision making

> Script (≈180 words): "Step three is my own weighted ranking. I want to be clear that this is my synthesis of the data, not a published result. I chose eight criteria, gave each a weight, and scored each material from one to five using fixed rules based on the data you have seen. Optical properties get zero weight. I ran two scenarios. In the first, cost and fire resistance weigh more, like a mass-market car under China's new fire rule. Here, press-hardened steel wins clearly with 3.75, ahead of aluminium with 3.15. In the second scenario, range and cooling weigh more, like a long-range premium car. Now aluminium and carbon fibre tie at 3.30, and steel drops to third. Some results do not change: stainless steel and magnesium never rise above fourth. The most important lesson is this: moving only 10 to 15 percentage points of weight changes the winner. So the material choice is really a decision about priorities. And because no single material wins everything, the best enclosure uses each material where it works best. That is the idea behind the structure design."

## Part 4 – Structure design (slides 13–15, 3:30)

Ý chính của phần này: mỗi bộ phận có một nhiệm vụ chính, nên mỗi bộ phận dùng vật liệu phù hợp nhất với nhiệm vụ đó. Slide 15 chốt lại bằng thiết kế đa vật liệu, nối trực tiếp với kết luận của Phần 3.

### Slide 13 – Anatomy: every part has one main job

- **Title:** Every part of the enclosure has one main job
- **Text on slide (bảng 6 dòng):**

| Part | Main job | Real example |
| --- | --- | --- |
| Tray (floor) | Carry cells, floor stiffness, hold cooling | Audi e-tron: extruded aluminium cooling chambers bonded under the housing \[7\] |
| Side frame / sill | Absorb side-impact energy | Audi e-tron: "cast aluminum nodes and extruded sections" \[7\] |
| Cross members | Transfer side load across the car | SAIC-GM Ultium: 1500 MPa steel beams \[86\] |
| Underbody plate | Stop stones and kerbs | Audi e-tron: 3.5 mm aluminium plate \[7\] |
| Lid | Close, seal, protect cabin from fire | BYD CTB: battery cover = car floor \[36\] |
| Seal + vent | Keep water out, let gas out | GM patent: 6 mm bead compressed to \~4 mm \[88\]; Gore vent opens at 150 ± 50 mbar \[89\] |

- **Visual:** hình tách lớp (exploded view) của hộp pin từ trên xuống: lid → cells/modules → cross members → tray + cooling plate → underbody plate, có mũi tên chỉ từng bộ phận. Có thể dùng ảnh Audi e-tron battery từ \[7\]. Thêm dòng nhỏ: *Audi e-tron crash structure: 47% extrusions, 36% sheet, 17% castings; bolted at 35 points, +27% body torsional rigidity* \[7\].
- **Footer sources:** \[7\] Audi Technology Portal · \[36\] Gasgoo 2022 · \[86\] 42how 2022 · \[88\] US Patent 11,515,600 B2 (GM) · \[89\] W. L. Gore technical data sheet 2025

**3D model (bắt buộc) – Model A, từng bộ phận sáng lên:** dùng lại trạng thái tách lớp của slide 3 (Morph nối tiếp, khán giả nhận ra ngay).

1. Khi script nhắc tới bộ phận nào thì bộ phận đó sáng lên, các phần khác mờ đi: `Tray` (cắt ngang để thấy kênh làm mát) → `Sill_L` → `CrossMember` → `Shield` (nhãn *3.5 mm aluminium, Audi e-tron* \[7\]) → `Lid`.
2. Cảnh phóng to cuối cùng (khoảng 4 giây): mặt cắt mép hộp. Nắp hạ xuống, bép keo `Seal` bị ép từ 6 mm xuống khoảng 4 mm \[88\]. Sau đó `Vent` mở ra, nhãn *opens at 150 ± 50 mbar* \[89\].

- Nếu dùng Spline (bản web): đặt hotspot, click vào bộ phận sẽ hiện ô nhỏ ghi nhiệm vụ của nó, dùng được khi trả lời câu hỏi.

> Script (≈150 words): "Now let's open the box. The easiest way to understand the structure is to match each part to its main job. The tray carries the cells and the cooling system. Audi, for example, bonds extruded aluminium cooling chambers under the housing. The side frame, or sill, absorbs energy in a side crash. Cross members do something different: they do not absorb energy, they pass the load across the car to the other side. The underbody plate stops stones; on the Audi e-tron it is a 3.5 millimetre aluminium plate. The lid closes the box, and in BYD's design it is also the cabin floor. Finally, a seal and a vent. GM's patent squeezes a 6 millimetre bead of sealant down to about 4 millimetres, and a Gore vent opens at about 150 millibar to release gas. Audi's frame mixes extrusions, sheet and castings, and the whole pack adds 27 percent to the car's torsional stiffness."

### Slide 14 – Architectures: from a box of modules to a structural floor

- **Title:** The more integrated the pack, the more the enclosure becomes the car body
- **Text on slide (sơ đồ 3 bậc từ trái sang phải):**
  - **Module pack:** cells → modules → enclosure. Enclosure frame carries all loads; modules replaceable. Examples: Audi e-tron (36 modules), VW MEB (up to 12 modules) \[7\]\[26\]
  - **Cell-to-pack (CTP):** no modules; cells act as beams. Volume use >50% (CATL 2019) to 72% (Qilin), manufacturer claims \[31\]. Examples: BYD Blade, CATL Qilin \[32\]
  - **Cell-to-body / cell-to-chassis (CTB/CTC):** lid = floor; pack = body structure. BYD claims 40,000 N·m/deg torsional stiffness \[36\]; Leapmotor +25% \[35\]. Tesla 4680 pack "not envisioned for repairs" (Munro) \[92\]
  - Trade-off arrow: *integration ↑ → fewer parts, more stiffness → repairability ↓*
- **Visual:** 3 hình mặt cắt đơn giản đặt cạnh nhau (hộp có module / hộp chỉ có cell / cell kẹp giữa sàn xe và đáy), một mũi tên dài bên dưới ghi "integration". Có thể nhắc ngắn T-shaped pack (Chevrolet Volt) là kiểu cũ \[18\].
- **Footer sources:** \[7\] Audi · \[26\] VW Group · \[31\] CATL via Kyodo · \[32\] Gasgoo 2020 · \[35\] CnEVPost 2022 · \[36\] Gasgoo 2022 · \[92\] InsideEVs · \[30\] Koloch et al., WEVJ 2025 (145-pack study)

**3D model (nên có) – Model D, morph qua 3 kiến trúc:** cùng một khay, chuyển dần trong khoảng 12 giây.

1. **Module pack:** khay chứa 12 hộp module, mỗi module có vỏ riêng, dầm ngang nằm giữa các module \[7\]\[26\].
2. **Cell-to-pack:** vỏ module mờ dần rồi biến mất, các cell kéo dài thành dải mỏng nằm ngang hết chiều rộng khay (kiểu blade \[32\]), số dầm ngang giảm. Bộ đếm góc slide: *volume use: <50% → 72% (manufacturer claims)* \[31\].
3. **Cell-to-body:** sàn xe có ray ghế hạ xuống và hòa vào nắp pin, nhãn *lid = floor* \[36\].

- Mũi tên dưới cùng chạy theo chuyển động: *integration ↑, parts ↓, repairability ↓*.

> Script (≈150 words): "The structure also depends on how much the battery is integrated into the car. In a classic module pack, cells sit inside modules, and the enclosure alone carries every load. This needs heavy internal frames, but a broken module can be replaced. In cell-to-pack designs, like BYD's Blade or CATL's Qilin, the module layer disappears. The long cells themselves work like beams, so fewer cross members are needed, and CATL claims the space used by cells rises from below 50 to 72 percent. The final step is cell-to-body. Here the lid of the battery is the floor of the car. BYD claims its car body becomes much stiffer this way. But there is a price: Tesla's structural pack is filled with foam, and teardown experts said it was not designed to be repaired. So as integration increases, we gain stiffness and space, but we lose repairability."

### Slide 15 – Designing for crash, fire and sealing → multi-material layout

- **Title:** Absorb energy outside, transfer load inside, contain fire on top
- **Text on slide (3 cột + 1 hình):**
  - **Crash:** sill absorbs side-pole energy, "no intrusion whatsoever into the cells"; cross members transfer load, not absorb it; a 1700 MPa roll-formed steel sill performs like an aluminium 6082-T6 multi-cell beam \[84\]. Underbody: a sandwich shield cut cell deformation by >50% vs a 6.35 mm aluminium plate \[98\]
  - **Fire:** barriers between cells (a polyimide-silica aerogel fully stopped propagation in one study \[69\]), vents that open under pressure, gas paths away from the cabin \[90\]
  - **Sealing:** perimeter bead with controlled compression → tray flatness matters \[88\]
  - **Reference layout (own synthesis):** aluminium extrusion tray with built-in cooling + steel or multi-cell aluminium sills + sandwich underbody shield + FR SMC or steel lid with mica/aerogel liner \[7\]\[69\]\[84\]
- **Visual:** mặt cắt ngang hộp pin (cross-section) với màu theo vật liệu: xám = thép (sill, dầm), xanh = nhôm (khay + tấm làm mát), cam = SMC (nắp), vàng = lớp mica/aerogel. Mũi tên đỏ từ bên hông thể hiện lực va cột đi qua sill và dầm ngang (load path). Xem sơ đồ mẫu ở cuối phần này.
- **Footer sources:** \[7\] Audi · \[69\] Zhou et al., Polym. Degrad. Stab. 2025 · \[84\] SSAB Docol EV concept · \[88\] GM patent · \[90\] E-Mobility Engineering (CATL Qilin) · \[98\] Zhu et al., SAE 2018-01-1438

**3D model (bắt buộc) – Model A mặt cắt, 3 tình huống:** cắt Model A theo mặt phẳng ngang (giống hình 2D bên dưới), dùng cùng bảng màu.

1. **0–5 s, va cột bên hông:** một cột tròn màu đỏ tiến vào `Sill_L`, sill bị bẹp (biến dạng bằng shape key). Một mũi tên phát sáng chạy qua `CrossMember` sang `Sill_R`, các cell giữ nguyên và hiện dấu tích xanh \[84\].
2. **5–10 s, va đáy:** một hòn đá đập vào `Shield` từ dưới. Cả tấm kẹp võng rộng (biến dạng toàn cục), không chạm tới cell \[98\].
3. **10–15 s, cháy một cell:** một cell chuyển đỏ, lớp `Barrier` và vách giữa các cell sáng hồng và giữ lại. Hạt khí thoát qua `Vent` ra phía ngoài, xa khoang hành khách \[69\]\[90\].

- Ghi chú bắt buộc trên slide: *Illustrative animation, not simulation results*. Đây là minh họa nguyên lý, không phải kết quả mô phỏng phần tử hữu hạn (FEA). Nếu bị hỏi, hãy nói rõ điều này.

> Script (≈160 words): "Let me finish this part with three design rules. First, crash. In a side-pole impact, the sill on the outside must absorb the energy, because nothing may enter the cells. The cross members inside should not absorb energy; they pass the force to the other side. SSAB showed that a roll-formed martensitic steel sill can match an aluminium multi-cell beam. Under the car, an MIT and Tsinghua study found that a sandwich shield reduced cell deformation by more than half. Second, fire: insulating barriers between cells, vents that open under pressure, and paths that send hot gas away from the passengers. Third, sealing: the seal works only if the tray is very flat. Putting everything together, my proposed layout is multi-material: an aluminium tray with built-in cooling for light weight and heat transfer, steel or multi-cell aluminium sills for crash, a sandwich shield underneath, and a flame-retardant lid with a fire barrier on top. Now, how do we actually make it?"

&#91;embedded content: Slide 15 visual · multi-material cross-section and load path\]

Hình mẫu cho slide 15: mỗi màu là một vật liệu, mũi tên đỏ là lực va cột đi vào sill. Hình này cũng dùng lại được (thu nhỏ) ở slide 19.

## Part 5 – Production method (slides 16–18, 3:00)

Slide 16 giới thiệu nhanh 4 nhóm phương pháp. Slide 17–18 trình bày chi tiết phương pháp phổ biến và đã được chứng minh nhất trong sản xuất hàng loạt: **đùn ép nhôm 6xxx + hàn ma sát khuấy (FSW)**. Lựa chọn này khớp với thiết kế khay nhôm ở Phần 4 và với kết luận của báo cáo \[102\]\[103\].

### Slide 16 – Four ways to make the box

- **Title:** Production volume decides the route
- **Text on slide (bảng 4 dòng):**

| Route | Material | Speed | Best fit | Main risk |
| --- | --- | --- | --- | --- |
| Extrusion + friction stir welding | 6xxx aluminium | \~300 s per tray per 2-gantry cell \[129\] | Medium-to-high volume, many pack sizes | Distortion, slow welding |
| High-pressure die casting (megacasting) | Heat-treat-free AlSi | \~120–150 s per large casting \[110\] | Very high, stable volume | Dies cost "several million dollars"; porosity \[108\] |
| Stamping, hot stamping, roll forming | AHSS, PHS 1500 | Body-shop rates | Lowest-cost cars | Mass, springback, flatness \[77\]\[115\] |
| SMC compression moulding | FR glass-fibre SMC | 60–180 s \[120\] | Lids and covers | Needs metal frame for crash \[87\] |

- **Visual:** 4 ảnh nhỏ: profile nhôm đùn ép, máy ép gigacasting (ví dụ Honda 0 Series battery case: 60+ parts → 3 parts \[100\]), khay thép dập, nắp SMC.
- **Footer sources:** \[77\] ArcelorMittal, Great Designs in Steel 2023 · \[87\]\[120\] CompositesWorld · \[100\] Honda 2024 · \[108\] ASSEMBLY Magazine 2025 · \[110\] S&P Global Mobility 2023 · \[115\] FormingWorld 2026 · \[129\] AluStir (consultancy estimate)

> Script (≈120 words): "There are four main ways to make an enclosure. Aluminium extrusions joined by friction stir welding are the established workhorse. High-pressure die casting, or megacasting, replaces dozens of parts with a few huge castings: Honda turns more than 60 parts into 3. But the dies cost millions, so it only pays at very high volume. Steel stamping, hot stamping and roll forming reuse the existing body shop and give the lowest cost, but the box is heavier. And compression-moulded SMC is now standard for lids, though it needs a metal frame to take crash loads. For the rest of this part, I will focus on the most widely proven route for mass production: aluminium extrusion plus friction stir welding."

### Slide 17 – Chosen method: aluminium extrusion + friction stir welding

- **Title:** Extrusion shapes the profiles; friction stir welding joins them without melting
- **Text on slide (quy trình 6 bước, dạng mũi tên):**
  1. **Heat** a 6xxx aluminium billet (≈510 °C; die ≈450 °C) \[102\]
  2. **Extrude** through a shaped die, like toothpaste: multi-hollow floor and frame profiles (ram speed 3 mm/s, ratio ≈26 in one study) \[102\]
  3. **Quench and age** to T6 (spray quenching gave ≈10% higher tensile strength than air cooling) \[102\]
  4. **Friction stir weld** the long floor seams: rotating tool, solid state, no filler or shielding gas, low distortion \[103\]
  5. **Add** frame joints (MIG), adhesive and coatings \[105\]
  6. **Test** every tray: helium leak test + flatness check \[128\]\[115\]
- **Visual:** sơ đồ dòng chảy 6 ô từ trái sang phải (xem sơ đồ mẫu bên dưới), cộng một hình minh họa nguyên lý FSW: dụng cụ quay có vai (shoulder) và chốt (pin) đi dọc đường nối giữa hai tấm nhôm. Video ngắn 10 giây về FSW nếu được phép.
- **Footer sources:** \[102\] Kneuper et al., Automotive Innovation 7:182–193, 2024, DOI 10.1007/s42154-023-00267-8 · \[103\] EUROGUSS 365, 2022 · \[105\] Benteler · \[115\] FormingWorld · \[128\] Marposs

**3D model (bắt buộc) – Model E, đùn ép + hàn ma sát khuấy:** khoảng 15–20 giây, hoặc chia thành 4 đoạn ngắn chạy theo từng bước của script.

1. **Đùn ép:** phôi nhôm hình trụ màu cam rực (nhãn *≈510 °C*) bị pit-tông đẩy qua khuôn thép. Thanh profile có nhiều lỗ rỗng chạy ra; cắt ngang để thấy lỗ rỗng \[102\].
2. **Làm nguội:** profile chuyển từ màu cam sang màu bạc, các thanh trượt vào nằm sát nhau.
3. **Hàn ma sát khuấy:** dụng cụ hình trụ có vai (shoulder) và chốt ren (pin) quay, cắm vào đường nối rồi chạy dọc theo nó. Phía sau để lại đường hàn có vân hình bán nguyệt, kèm nhãn *solid state – no melting* \[103\]. Nên phóng to cảnh này vì đây là ý chính của slide.
4. **Kiểm tra:** khay hoàn chỉnh đi vào buồng kín, các hạt heli bao quanh, đèn xanh *PASS* \[128\].

> Script (≈150 words): "Here is how it works, step by step. First, an aluminium billet is heated to about 500 degrees. It is then pushed through a shaped steel die, a bit like squeezing toothpaste, to make long profiles. For the floor, these are flat profiles with hollow chambers inside, which protect against impacts from below and can carry coolant. The profiles are quenched and aged to the T6 condition for full strength. Next comes the key step: friction stir welding. A rotating tool presses into the joint between two profiles. Friction heats the metal until it is soft, but it never melts, and the tool stirs the two sides together. Because nothing melts, there is no filler wire, no shielding gas, little distortion, and the seam is leak-tight. A peer-reviewed study calls it the predominant method for trays. Finally, frame parts are added, the tray is coated, and every single tray is leak-tested with helium."

&#91;embedded content: Slide 17 visual · extrusion + FSW process, 6 steps\]

Hình mẫu cho slide 17: đọc theo hình chữ U, bước 4 (FSW) được tô màu vì đây là bước quan trọng nhất.

### Slide 18 – Extrusion + FSW in numbers: why it wins, where it struggles

- **Title:** Proven in mass production, but slow and sensitive to distortion
- **Text on slide (2 cột):**
  - **Why it wins**
    - Factory proof: TPV Automotive builds trays from 4 cover plates + 9 extrusions on 6 FSW gantries, each ≈80 trays/day \[103\]
    - Cheap dies; one design scales to many pack sizes \[129\]
    - Leak-tight solid-state seams: "the predominant method" for linear tray joints \[102\]
    - Aluminium is recyclable with ≈95% energy saving \[79\]
  - **Where it struggles**
    - Slow: at 3 m/min, a 2-gantry cell needs ≈300 s per tray; €2.5 M per cell; ≈€15 per car for FSW vs ≈€4 for robotic MIG sealing welds (consultancy "educated guesses") \[129\]
    - Distortion: one FSW battery tray study measured ±3 mm, reduced to ±0.75 mm by burnishing \[112\]
    - Strict quality limits: helium leak ≤ 1×10⁻³ mbar·l/s (research limit) \[102\]; flange flatness ±1.5 mm \[115\]
- **Visual:** bên trái ảnh dây chuyền FSW gantry; bên phải bảng "pros / cons" với 2 màu. Một dòng nhỏ ghi xu hướng: *Trend: cooling integrated into the structure, larger castings, more recycled aluminium* \[100\]\[71\]\[133\].
- **Footer sources:** \[71\] Fraunhofer IWU 2024 · \[79\] International Aluminium Institute · \[100\] Honda · \[102\] Kneuper et al. 2024 · \[103\] EUROGUSS 365 · \[112\] Sabry et al., J. Manuf. Processes 101:1109–1123, 2023, DOI 10.1016/j.jmapro.2023.06.035 · \[115\] FormingWorld · \[129\] AluStir · \[133\] Novelis 2025

> Script (≈130 words): "Why is this route so common? Because it is proven. In Slovenia, TPV Automotive builds trays from nine extrusions and four cover plates on six welding gantries, and each gantry makes about 80 trays a day. The dies are cheap, the same profiles can be cut to many pack sizes, and the seams are leak-tight. But it has weaknesses. Welding at about 3 metres per minute is slow, and a consultancy estimates about 15 euros of welding cost per car. Heat from welding can also bend the tray by about 3 millimetres, while the seal needs a flatness of about 1.5 millimetres, so extra straightening may be needed. That is why the industry is now testing bigger castings and integrated cooling. Still, for most carmakers today, extrusion plus friction stir welding is the safest choice."

## Part 6 – Conclusion (slides 19–20, 1:15) + Q&A preparation

### Slide 19 – Conclusion

- **Title:** No single winner: the best box puts each material where it works best
- **Text on slide (4 ý):**
  1. The enclosure's job changed twice: from carrying mass, to resisting impact, to **containing fire** (GB 38031-2025: no fire for ≥2 h) \[3\]
  2. Ranking depends on priorities: steel wins on cost and fire; aluminium and CFRP win on range (own synthesis) \[4\]\[5\]\[6\]
  3. Recommended design: **multi-material** – aluminium tray with built-in cooling, steel or multi-cell aluminium sills, sandwich underbody shield, FR SMC or steel lid with fire barrier
  4. Recommended production: **6xxx aluminium extrusion + friction stir welding**, the most proven mass-production route \[102\]\[103\]
- **Open questions (dòng nhỏ):** no independent side-by-side crash or fire tests across materials; no peer-reviewed enclosure cost model; most fire and cost data are industry claims.
- **Visual:** hình mặt cắt đa vật liệu ở slide 15 thu nhỏ, cộng 4 icon tương ứng 4 ý.
- **Footer sources:** \[3\] AVL · \[4\] Gökciler & Geren 2026 · \[5\] Li et al. 2024 · \[6\] Fragiadaki et al. 2026 · \[102\] Kneuper et al. 2024 · \[103\] EUROGUSS 365

**3D model (tùy chọn) – Model A hoàn chỉnh:** Model A lắp đầy đủ, tô màu theo vật liệu, xoay chậm 360° trong 8 giây và lặp lại. 4 ý kết luận hiện lần lượt bên cạnh. Đây là lần cuối khán giả thấy mô hình gốc, nên bài kết thúc cùng một hình ảnh với lúc mở đầu.

> Script (≈150 words): "To conclude. The enclosure began as a box that carried heavy batteries. It became a crash structure, and with China's new rule, it is now also a fire container. When we rank the materials, there is no single winner. Steel wins when cost and fire matter most; aluminium and carbon fibre win when range matters most. So the material choice is really a decision about priorities, set by regulation and by the type of car. My recommendation is a multi-material enclosure: an aluminium tray with built-in cooling, strong steel or multi-cell aluminium at the sides, a protective shield underneath, and a flame-retardant lid with a fire barrier. And for production, aluminium extrusion with friction stir welding is today's most proven route. One honest limitation: most fire and cost data still come from industry, so independent tests are needed. Thank you for listening. I am happy to take your questions."

### Slide 20 – References

Danh sách nguồn đầy đủ (xem mục References bên dưới). Nếu slide quá dài, chia thành 2 slide: "Peer-reviewed and official sources" và "Industry and trade sources". Không cần đọc slide này.

### Q&A – câu hỏi có thể gặp và cách trả lời

| Possible question | Suggested answer (English) |
| --- | --- |
| Why not magnesium if it has the best stiffness per kg? | "Its solidus is only about 490–540 °C, it has low fatigue strength and the highest CO₂ per kg, about 22–23 kg, and I found no enclosure case study. So I screened it out." \[55\]\[56\] |
| Your weights are subjective. How do you justify them? | "Yes, they are my choice. That is why I showed two scenarios. The key finding is that the ranking flips when 10–15 points of weight move, so priorities decide." |
| Aluminium melts at 600 °C. How can it pass the fire rules? | "The shell alone may not. Designs add mica or aerogel liners, flame-retardant lids and vents. One aerogel barrier fully stopped propagation in a peer-reviewed test." \[69\] |
| Why not gigacasting, like Tesla? | "It cuts parts dramatically, but dies cost several million dollars and it needs very high, stable volume. Also, Tesla's castings are the underbody sections, not the battery tray itself." \[100\]\[108\] |
| Is steel making a comeback? | "Yes for cost and fire: Hyundai's E-GMP uses hot-stamped steel. But some steel claims, like '37% lighter', are against a fully enclosed design, not against aluminium." \[27\]\[76\] |
| Why are optical properties ignored? | "The box is hidden under the floor, so colour and transparency do not matter. UV resistance could matter for exposed composites, but I found no data, so I gave it zero weight." |
| How reliable are your sources? | "Peer-reviewed papers and official regulations for the key claims; industry and market-research numbers are labelled as such on the slides." |

## References

Số thứ tự giữ nguyên như trong báo cáo nghiên cứu *Building the box that guards EV batteries*, nên bạn tra ngược dễ dàng. Nhãn trong ngoặc vuông cho biết loại nguồn: **\[Peer-reviewed\]** bài báo học thuật có bình duyệt, **\[Official\]** văn bản chính thức hoặc cơ quan nhà nước, **\[Industry\]** doanh nghiệp hoặc hiệp hội, **\[Market research\]** công ty nghiên cứu thị trường, **\[Trade press\]** báo chuyên ngành, **\[Secondary\]** nguồn tổng hợp.

**Peer-reviewed papers and academic sources**

- &#91;4\] Gökciler, O.C. & Geren, N. "An Approach to Selection and Evaluation of Battery Enclosure Materials for Electric Vehicles." *International Journal of Automotive Science and Technology* 10(1):64–75, 2026. DOI: 10.30939/ijastech..1830219. https://dergipark.org.tr/en/pub/ijastech/article/1830219
- &#91;5\] Li, X., Zhang, Y., Liao, Y., et al. "Environmental impact assessment of battery boxes based on lightweight material substitution." *Scientific Reports* 14:2594, 2024. DOI: 10.1038/s41598-024-53238-2. https://link.springer.com/10.1038/s41598-024-53238-2
- &#91;6\] Fragiadaki, A., Vogiantzi, C. & Tserpes, K. "Cradle-to-Gate Sustainability Assessment of Composite and Metallic Battery Housings for Transport and Stationary Energy Storage Applications." *Batteries* 12(9):318, 2026; preprint DOI: 10.20944/preprints202607.2270.v1. https://www.preprints.org/manuscript/202607.2270
- &#91;8\] Shaikh et al. (PNNL). "Finite Element Analysis and Machine Learning Guided Design of Carbon Fiber Organosheet-based Battery Enclosures for Crashworthiness." arXiv:2309.00637. https://arxiv.org/pdf/2309.00637 \[Preprint\]
- &#91;10\] Zhang et al. *World Electric Vehicle Journal* 16(11):632, 2025. DOI: 10.3390/wevj16110632. https://www.mdpi.com/2032-6653/16/11/632
- &#91;30\] Koloch et al. *World Electric Vehicle Journal* 16(9):484, 2025. DOI: 10.3390/wevj16090484. https://www.mdpi.com/2032-6653/16/9/484
- &#91;42\] Del Pero, Berzi, Antonacci & Delogu. *Machines* 8(3):51, 2020. DOI: 10.3390/machines8030051. https://doi.org/10.3390/machines8030051
- &#91;50\] Ansys Granta EduPack. "Material Selection" lecture unit (2025 R1), citing M.F. Ashby, *Materials Selection in Mechanical Design*, 5th ed., Butterworth-Heinemann, 2016. https://ansys.synopsys.com/content/dam/web/academic/education-resources/2025r1/material-selection-lecture-unit-pptselen25.pdf \[Teaching resource\]
- &#91;59\] Zhang, Lin, Xiao, et al. "Top-Down Design Approach of Lightweight Composite Battery Pack Enclosure for Electric Vehicles Based on Numerical Modeling and Topology Optimization." *Polymers* 17(21):2897, 2025. DOI: 10.3390/polym17212897. https://pmc.ncbi.nlm.nih.gov/articles/PMC12608331/ \[Cost-per-kg table unsourced in the paper\]
- &#91;69\] Zhou et al. "Fire-resistant polyimide-silica composite aerogels…" *Polymer Degradation and Stability* 241 (2025) 111574. DOI: 10.1016/j.polymdegradstab.2025.111574. https://ira.lib.polyu.edu.hk/handle/10397/114434
- &#91;73\] Jáquez-Muñoz et al. *Frontiers in Metals and Alloys* 2:1258941, 2023. DOI: 10.3389/ftmal.2023.1258941. https://www.frontiersin.org/journals/metals-and-alloys/articles/10.3389/ftmal.2023.1258941/full
- &#91;98\] Zhu, Zhang, Wierzbicki, Xia & Chen. "Structural Designs for Electric Vehicle Battery Pack against Ground Impact." SAE Technical Paper 2018-01-1438. DOI: 10.4271/2018-01-1438. https://saemobilus.sae.org/papers/structural-designs-electric-vehicle-battery-pack-ground-impact-2018-01-1438
- &#91;102\] Kneuper et al. "Mechanically Joined Extrusion Profiles for Battery Trays." *Automotive Innovation* 7:182–193, 2024. DOI: 10.1007/s42154-023-00267-8. https://link.springer.com/10.1007/s42154-023-00267-8
- &#91;112\] Sabry et al. *Journal of Manufacturing Processes* 101:1109–1123, 2023. DOI: 10.1016/j.jmapro.2023.06.035. https://impact.ornl.gov/en/publications/stress-characterization-for-friction-stir-welded-electric-vehicle/

**Official, government and standards sources**

- &#91;1\] Shaikh & Sharpe. Assessment of light-duty EV costs in Canada 2023–2040. ICCT Working Paper 2023-29. https://theicct.org/wp-content/uploads/2023/12/ID-46-–-Canada-EV-working-paper-29-letter-70113-v4\_final.pdf \[Research NGO\]
- &#91;2\] International Energy Agency. *Global EV Outlook 2026*, Executive summary. https://www.iea.org/reports/global-ev-outlook-2026/executive-summary
- &#91;11\] U.S. Department of Energy. "The History of the Electric Car." https://www.energy.gov/articles/history-electric-car
- &#91;48\] UN ECE Regulation No. 100, 02 series of amendments, Supplement 1. *Official Journal of the EU* L 87, 31 March 2015. https://eur-lex.europa.eu/eli/reg/2015/100/oj/eng/pdf
- &#91;88\] GM Global Technology Operations. US Patent 11,515,600 B2, "Electric vehicle battery enclosure with sealant and seal bead height maintenance" (2022). https://patents.google.com/patent/US11515600

**Standards summaries and consultancies**

- &#91;3\] AVL / H&Z. White paper "Regulation GB 38031-2025" (October 2025). https://www.avl.com/sites/default/files/2025-10/gl\_pte\_en\_whitepaper\_regulation\_gb38031-2025\_web\_10.25.pdf \[Official text not opened\]
- &#91;45\] In Compliance Magazine. "Testing to UNECE Regulation 100 Requirements for Electric Vehicle Batteries." https://incompliancemag.com/testing-to-unece-regulation-100-requirements-for-electric-vehicle-batteries/
- &#91;129\] AluStir. "Cost of FSW of battery trays." https://alustir.com/english/fsw-battery-trays \[Consultancy; "educated guesses"\]

**Manufacturers and industry bodies \[Industry\]**

- &#91;7\] Audi Technology Portal. "Audi e-tron – Battery and Safety." https://www.audi-technology-portal.de/en/drivetrain/battery-and-charging/audi-e-tron-battery-and-safety
- &#91;16\] Toyota (GB) media. "RAV4 EV" press pack (1999). https://media.toyota.co.uk/wp-content/uploads/sites/5/1324550080rav4\_ev\_whole.pdf
- &#91;26\] Volkswagen Group. "In brief: key components for a new era – the battery system" (2019). https://www.volkswagen-group.com/en/press-releases/in-brief-key-components-for-a-new-era-the-battery-system-17010
- &#91;27\] ArcelorMittal Automotive. Summary of Hyundai's E-GMP announcement (2020). https://automotive.arcelormittal.com/92/150/398/language/ES
- &#91;31\] CATL press release via Kyodo. Qilin (CTP 3.0) launch (2022). https://kyodonewsprwire.jp/release/202206242941
- &#91;52\] AHSS Insights. "Press Hardening Steel Grades / boron steel." https://ahssinsights.org/tag/boron-steel/
- &#91;57\] IDI Composites. Flamevex / QISO product insert. https://ns1.idicomposites.com/pdfs/flamevex-qiso-insert.pdf
- &#91;58\] Hexcel. HexPly 8552 product data sheet. https://hexcel.com/wp-content/uploads/2026/01/HexPly\_8552\_us\_DataSheet.pdf
- &#91;70\] Envalior. "Innovative materials for lightweight EV battery enclosures." https://www.envalior.com/en-us/insights/blog/innovative-materials-for-Lightweight-ev-battery-enclosures.html
- &#91;71\] Fraunhofer IWU. "EV battery enclosures with lower carbon emissions" (COOLBat, 2024). https://www.iwu.fraunhofer.de/content/dam/iwu/en/documents/Press/2024-EV-Battery-Enclosures-with-Lower-Carbon-Emissions.pdf \[Research institute\]
- &#91;76\] AHSS Insights. "Steel E-Motive…" https://ahssinsights.org/?p=659492
- &#91;77\] Eldridge (ArcelorMittal). Great Designs in Steel 2023, Track 1 Session 4. https://www.steel.org/wp-content/uploads/2023/06/Track-1-Session-4-Eldridge-ArcelorMittal.pdf
- &#91;79\] International Aluminium Institute. "Aluminium Facts." https://international-aluminium.org/aluminium-facts/
- &#91;84\] SSAB. "Docol electric vehicle design concept." https://www.ssab.com/en/brands-and-products/ssab-docol/automotive-steel-resources/automotive-insights/ssab-docol-electric-vehicle-design-concept
- &#91;89\] W. L. Gore & Associates. Pressure-equalisation / burst vent technical data sheet (2025). https://gore.com/system/files/2025-03/gore-ptv-tec-ibs-2025-a4-en.pdf
- &#91;100\] Honda. "Honda 0 Tech MTG 2024: production technology." https://global.honda/en/tech/Honda\_0\_Tech\_MTG\_2024/production\_technology/
- &#91;105\] Benteler. "Battery trays." https://www.benteler.com/en/products-services/automotive-products/battery-trays/
- &#91;128\] Marposs. "Leak testing battery tray with helium accumulation chamber." https://www.marposs.com/eng/application/leak-testing-battery-tray-with-helium-accumulation-chamber
- &#91;133\] Novelis. Press release on aluminium roll-formed battery tray concepts (2025). https://novelis.com/?p=21009

**Market research \[Market research\]**

- &#91;9\] Stratview Research. "How battery enclosure design influences EV range." https://www.stratviewresearch.com/blogs/how-battery-enclosure-design-influences-ev-range
- &#91;38\] BloombergNEF. 2025 Battery Price Survey press release (9 December 2025). https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/
- &#91;39\] IMARC Group. "Electric Vehicle Battery Housing Market." https://www.imarcgroup.com/electric-vehicle-battery-housing-market
- &#91;40\] Global Market Insights. "Electric Vehicle Battery Case/Box Market." https://www.gminsights.com/industry-analysis/electric-vehicle-battery-case-box-market
- &#91;110\] Pope & Tao. "Gigacasting: the hottest trend in car manufacturing." S&P Global Mobility (2023). https://www.mobilityglobal.com/en-us/automotive-insights/blog/gigacasting-the-hottest-trend-in-car-manufacturing

**Trade press \[Trade press\]**

- &#91;12\] VEVA. "1912 Detroit Electric." https://veva.ca/Detroit-Electric \[Enthusiast source\]
- &#91;13\] WardsAuto. "GM EV1 set stage for Tesla, modern EVs." https://www.wardsauto.com/10-best-engines/gm-ev1-set-stage-tesla-modern-evs
- &#91;18\] WardsAuto. "Battery Pack Adds Muscle to Volt's Chassis" (2009). https://wardsauto.com/electric/battery-pack-adds-muscle-to-volt-s-chassis
- &#91;22\] Green Car Reports. "Five Questions: Peter Rawlinson, Tesla Motors Chief Engineer" (2011). https://www.greencarreports.com/news/1053555\_five-questions-peter-rawlinson-tesla-motors-chief-engineer
- &#91;23\] MIT Technology Review. "Tesla Adds Shielding to Prevent Model S Fires" (2014). https://www.technologyreview.com/2014/03/28/173529/tesla-adds-shielding-to-prevent-model-s-fires-protect-evs-reputation/
- &#91;32\] Gasgoo. "BYD launches blade battery…" (2020). https://autonews.gasgoo.com/articles/market-industry/byd-launches-blade-battery-to-put-end-to-spontaneous-combustions-in-evs-70017000
- &#91;35\] CnEVPost. "Leapmotor unveils CTC technology…" (2022). https://cnevpost.com/2022/04/25/leapmotor-unveils-ctc-technology-that-does-not-use-separate-battery-pack/
- &#91;36\] Gasgoo. "BYD launches CTB technology…" (2022). https://autonews.gasgoo.com/articles/news/byd-launches-ctb-technology-starts-presale-of-byd-seal-70020398
- &#91;46\] CarNewsChina. "China bans EV battery fires and explosions…" (2025). https://carnewschina.com/2025/04/17/china-bans-ev-battery-fires-and-explosions-with-groundbreaking-safety-standard-starting-july-2026
- &#91;86\] 42how. "Compared to Kirin, Blade, and Rubik's Cube, what level is General Motors' Ultium at?" (2022). https://en.42how.com/2022/07/27/compared-to-kirin-blade-and-rubiks-cube-what-level-is-general-motors-ultium-at/
- &#91;87\] CompositesWorld. "Designing a versatile, multi-material EV battery enclosure" (2021). https://www.compositesworld.com/articles/designing-a-versatile-multi-material-ev-battery-enclosure
- &#91;90\] E-Mobility Engineering. "CATL launches cell-to-pack battery (Qilin)." https://www.emobility-engineering.com/catl-cell-to-pack-battery-qilin/
- &#91;92\] InsideEVs. "See What's Under the Lid of Tesla's 4680 Structural Battery Pack." https://insideevs.com/news/599501/under-lid-tesla-4680-battery-pack/
- &#91;103\] EUROGUSS 365. "Lightweight construction for the automotive industry" (2022). https://www.euroguss.de/en/euroguss-365/2022/basic-knowledge/lightweight-construction-for-the-automotive-industry
- &#91;108\] ASSEMBLY Magazine. "Gigacasting: the next big idea in automotive manufacturing" (2025). https://www.assemblymag.com/articles/99720-gigacasting-the-next-big-idea-in-automotive-manufacturing
- &#91;115\] FormingWorld. "Cleveland-Cliffs stamping battery tray" (2026). https://formingworld.com/cleveland-cliffs-stamping-battery-tray/
- &#91;120\] CompositesWorld. "SMC material configurations tailored to automotive battery enclosure design" (2022). https://compositesworld.com/articles/smc-material-configurations-tailored-to-automotive-battery-enclosure-design

**Property databases \[Secondary\]**

- &#91;51\] MakeItFrom.com. "EN 1.0303 (C4C) Non-Alloy Steel." https://www.makeitfrom.com/material-properties/EN-1.0303-C4C-Non-Alloy-Steel
- &#91;53\] MakeItFrom.com. "6082 Aluminum vs. AISI 304 Stainless Steel." https://www.makeitfrom.com/compare/6082-AlSi1MgMn-3.2315-H30-A96082-Aluminum/AISI-304-S30400-Stainless-Steel
- &#91;54\] MakeItFrom.com. "5754 Aluminum vs. AISI 304 Stainless Steel." https://www.makeitfrom.com/compare/5754-AlMg3-3.3535-A95754-Aluminum/AISI-304-S30400-Stainless-Steel
- &#91;55\] MakeItFrom.com. "AZ91D Magnesium." https://makeitfrom.com/material-properties/AZ91D-M11916-Magnesium
- &#91;56\] MakeItFrom.com. "AM60B Magnesium." https://www.makeitfrom.com/material-properties/AM60B-AM60B-F-M10602-Magnesium
- &#91;62\] MakeItFrom.com. "Epoxy." https://www.makeitfrom.com/material-properties/Epoxy

Gợi ý: trên slide chỉ ghi dạng ngắn (ví dụ "\[5\] Li et al., Sci. Rep. 2024"), còn đầy đủ để ở slide 20. Nếu giảng viên yêu cầu ưu tiên nguồn học thuật, hãy nhấn mạnh các nguồn trong nhóm Peer-reviewed và Official khi nói.

## Bảng thuật ngữ cho người thuyết trình

Các thuật ngữ xuất hiện trong script, xếp theo thứ tự xuất hiện. Nên luyện phát âm tiếng Anh trước và nhớ từ tiếng Trung để trả lời nếu giảng viên hỏi bằng tiếng Trung.

| Tiếng Việt | English | 中文 | Pīnyīn |
| --- | --- | --- | --- |
| vỏ hộp pin | battery pack enclosure | 电池包壳体 | diànchíbāo kétǐ |
| ô pin | cell | 电芯 | diànxīn |
| module pin | module | 模组 | mózǔ |
| khay pin | tray | 电池托盘 | diànchí tuōpán |
| nắp trên | lid / cover | 上盖 | shànggài |
| dầm ngang | cross member | 横梁 | héngliáng |
| dầm bậu xe (sill) | side sill | 门槛梁 | ménkǎnliáng |
| tấm bảo vệ đáy | underbody plate | 底部护板 | dǐbù hùbǎn |
| tấm làm mát bằng chất lỏng | liquid cooling plate | 液冷板 | yèlěngbǎn |
| van xả áp | pressure relief vent | 泄压阀 | xièyāfá |
| thoát nhiệt (cháy dây chuyền) | thermal runaway | 热失控 | rè shīkòng |
| lan truyền nhiệt | thermal propagation | 热扩散 | rè kuòsàn |
| va chạm cột bên hông | side pole impact | 侧柱碰撞 | cèzhù pèngzhuàng |
| điện trở cách điện | insulation resistance | 绝缘电阻 | juéyuán diànzǔ |
| khối lượng riêng | density | 密度 | mìdù |
| mô đun đàn hồi | Young's modulus | 弹性模量 | tánxìng móliàng |
| giới hạn bền kéo | tensile strength | 抗拉强度 | kànglā qiángdù |
| độ giãn dài | elongation | 延伸率 | yánshēnlǜ |
| độ bền mỏi | fatigue strength | 疲劳强度 | píláo qiángdù |
| chỉ số vật liệu | material index | 材料指数 | cáiliào zhǐshù |
| độ cứng riêng | specific stiffness | 比刚度 | bǐ gāngdù |
| đường rắn (bắt đầu nóng chảy) | solidus | 固相线 | gùxiàngxiàn |
| hệ số dẫn nhiệt | thermal conductivity | 导热系数 | dǎorè xìshù |
| ăn mòn điện hóa (cặp galvanic) | galvanic corrosion | 电偶腐蚀 | diàn'ǒu fǔshí |
| thép dập nóng | press-hardened steel | 热成形钢 | rèchéngxíng gāng |
| hợp kim nhôm | aluminium alloy | 铝合金 | lǔhéjīn |
| hợp kim magie | magnesium alloy | 镁合金 | měihéjīn |
| vật liệu ép tấm (SMC) | sheet moulding compound | 片状模塑料 | piànzhuàng mósùliào |
| polyme gia cường sợi carbon | carbon-fibre-reinforced polymer (CFRP) | 碳纤维增强复合材料 | tànxiānwéi zēngqiáng fùhé cáiliào |
| ra quyết định đa tiêu chí | multi-criteria decision making | 多准则决策 | duō zhǔnzé juécè |
| phương pháp điểm có trọng số | weighted-sum method | 加权评分法 | jiāquán píngfēn fǎ |
| đánh giá vòng đời | life-cycle assessment | 生命周期评价 | shēngmìng zhōuqī píngjià |
| ô pin đến khối pin | cell-to-pack (CTP) | 电芯到电池包 | diànxīn dào diànchíbāo |
| tích hợp pin vào thân xe | cell-to-body (CTB) | 电池车身一体化 | diànchí chēshēn yītǐhuà |
| đùn ép | extrusion | 挤压成形 | jǐyā chéngxíng |
| hàn ma sát khuấy | friction stir welding (FSW) | 搅拌摩擦焊 | jiǎobàn mócā hàn |
| đúc áp lực cao tích hợp (gigacasting) | integrated die casting | 一体化压铸 | yītǐhuà yāzhù |
| dập | stamping | 冲压 | chōngyā |
| cán lăn tạo hình | roll forming | 辊压成形 | gǔnyā chéngxíng |
| ép khuôn (composite) | compression moulding | 模压成型 | móyā chéngxíng |
| kiểm tra rò rỉ bằng heli | helium leak test | 氦气检漏 | hàiqì jiǎnlòu |
| độ phẳng | flatness | 平面度 | píngmiàndù |

Học theo nhóm chữ: **压** (yā = ép) xuất hiện trong 挤压 (đùn ép), 冲压 (dập), 压铸 (đúc áp lực), 辊压 (cán lăn), 模压 (ép khuôn), 泄压阀 (van xả áp). **热** (rè = nhiệt) xuất hiện trong 热失控, 热扩散, 热成形钢, 导热系数.
