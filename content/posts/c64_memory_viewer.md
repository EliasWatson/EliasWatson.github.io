---
title: "Commodore 64 Memory Viewer"
date: 2024-06-26T20:00:00-05:00
summary: "C64 memory viewer written in BASIC"
tags: ["c64", "basic", "retro"]
draft: false
---

<pre class="c64">
5 PRINT "";
10 IA=2048
20 FOR I=0 TO 15
30 PRINT "";
40 N=INT(IA/256)
50 GOSUB 1000
60 N=IA AND 255
70 GOSUB 1000
80 PRINT "";
90 FOR J=0 TO 7
100 PRINT "";
110 IF (J AND 1)=0 THEN PRINT "";
120 N=PEEK(IA+J)
130 GOSUB 1000
140 NEXT J
150 PRINT "        ";
160 FOR J=0 TO 7
170 N=PEEK(IA+J)
175 K=1024+(I*40)+22+J
180 IF N<32 THEN POKE K,32
190 IF N>=32 AND N<128 THEN POKE K,N
200 IF N>=128 AND N<160 THEN POKE K,32
210 IF N>=160 THEN POKE K,N
220 NEXT J
350 PRINT
360 IA=IA+8
370 NEXT I
990 END
1000 FOR NI=1 TO 2
1010 LN=INT(N/16)
1020 IF LN<10 THEN PRINTCHR$(48+LN);
1030 IF LN>=10 THEN PRINTCHR$(65+(LN-10));
1040 N=(N AND 15)*16
1050 NEXT NI
1060 RETURN
</pre>

![](/c64_memory_viewer/output.jpeg)

---

_Commodore 64 font from [Style](https://style64.org/c64-truetype)_
