# Ntree
**Twoje osobiste cyfrowe drzewko.**

###DNA drzewa
```text
"#6e3b1c&0.7&0.83&0.16|0|0|61.4,0|1.3|0|29.45,0.42|2.6|0|23.25,0.17|4|0|88.68^#91b341&4.2|3|2|x|y|z|0,4|2|2.8|x|y+2|z|5,4|2|2.8|x|y+4|z|0,4|2|2.8|x|y+6|z|0"

#6e3b1c &  ->  kolor pnia 
0.7 &  ->  szerokość pnia 
0.83 &  ->  shrink pnia 
	0.16|0|0|61.4,  ->  segment 1 pnia (x, y, z, seed) 
	0|1.3|0|29.45,  ->  segment 2 pnia (x, y, z, seed)
	0.42|2.6|0|23.25,  ->  segment 3 pnia (x, y, z, seed)
	0.17|4|0|88.68  ->  segment 4 pnia (x, y, z, seed)
^
#91b341 &  ->  kolor góry 
3 &  ->  wysokosc czubka
0.3 &  ->  offsetX czubka
0.3 &  ->  offsetZ czubka
	4.2|2.8|0,  ->  segment 1 góry (średnica dołu, średnica góry, wysokość, obrót osi Y)
	4|2|2.8|5,  ->  segment 2 góry (średnica dołu, średnica góry, wysokość, obrót osi Y)
	3.8|2|0,  ->  segment 3 góry (średnica dołu, średnica góry, wysokość, obrót osi Y)
	3.6|2|0  ->  segment 4 góry (średnica dołu, średnica góry, wysokość, obrót osi Y)
	
	
```

Fazy wzrostu:
- wyrosniecie zielonego pnia (stage 1, trwa 5 dni, scale 0 - 0.05)
- wyrastanie po kolei top segmentow (stage 2, trwa 15 dni, scale 0.05 - 0.2)
- rosniecie calego drzewa (stage 3, trwa 80 dni, scale 0.2 - 1)


##TODO:

Wcięcia top segmentów:
Rozsunąć wierzchołki dołu stożka.

##Tapeta
https://uploads-ssl.webflow.com/5d64ad209093d7b315c3591a/5e9697299bac7ccab1b35410_unity-game-asset-low-poly-modular-terrain-pack-very-large_2.jpg
