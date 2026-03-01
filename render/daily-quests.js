async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token });
  return userIdResult.user_id;
}

const questsValues = {
    //school
    learning : {
        options: [
            { label: "2 hodiny", coins: 2}, { label: "3 hodiny", coins: 4}, { label: "4 hodiny", coins: 7},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste se v kuse učili.",
        messageAfter: "Skvělá práce! Naučili jste se něco nového a získali odměnu!"
    },
    assignment : {
        options: [
            { label: "vypracování úkolu 4 dny před odevzdáním", coins: 2}, { label: "vypracování úkolu 1 týden před odevzdáním", coins: 5},
        ],
        messageBefore: "Vyberte prosím, kolik dní před odevzdáním jste dokončili úkol.",
        messageAfter: "Nenechávat věci na poslední chvíli je základ úspěchu! Získali jste odměnu za svou včasnou práci!"
    },
    noskip : {
        options: [
            { label: "nevynechání školy 2 měsíce", coins: 3}, { label: "nevynechání školy minimálně půl roku", coins: 7},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste nevynechali školu úmyslně.",
        messageAfter: "Nevynechávání školy je základ úspěchu :) Získali jste odměnu za svou odpovědnost!"
    },
    //work
    addWork : {
        options: [
            { label: "30 minut práce navíc", coins: 3}, { label: "1 hodina práce navíc", coins: 5},
        ],
        messageBefore: "Vyberte prosím, kolik jste odvedli práce navíc, která nebyla finančně oceněna a byla z dobrého srdíčka.",
        messageAfter: "Práce navíc bez odměny je velmi prospěšná a kolegové Vám jistě děkují! Získali jste odměnu za svou obětavost!"
    },
    helpColleague : {
        options: [
            { label: "pomoc kolegovy v nesnázích", coins: 2},
        ],
        messageBefore: "Pomohli jste kolegoviv nesnázích aniž by jste museli?",
        messageAfter: "Dobrovolná pomoc kolegovy je základ pro dobré vztahy! Získali jste odměnu za svou ochotu pomoci."
    },
    completeTask : {
        options: [
            { label: "dokončení tasku 2 dny před deadlinem", coins: 2}, { label: "dokončení taksu 4 dny před deadlinem", coins: 5}, { label: "dokončení tasku 1 týden před deadlinem", coins: 8},
        ],
        messageBefore: "Vyberte prosím, kolik dní před deadlinem jste dokončili task.",
        messageAfter: "Nenechávat věci na poslední chvíli je základ úspěchu! Získali jste odměnu za svou včasnou práci!"
    },
    //Sport
    yoga : {
        options: [
            { label: "15 minut jógy", coins: 1}, { label: "20 minut jógy", coins: 2}, { label: "30 minut jógy", coins: 4}, { label: "1 hodina jógy", coins: 8},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste cvičili jógu.",
        messageAfter: "Skvělá práce! Cvičení jógy prospívá tělu i duši a získali jste odměnu za svou aktivitu."
    },
    running : {
        options: [
            { label: "běh venku", coins: 4},
        ],
        messageBefore: "Běhali jste venku?",
        messageAfter: "Běh venku je skvělý způsob jak si vybít energii a uklidnit duši! Získali jste odměnu za svou aktivitu."
    },
    walking : {
        options: [
            { label: "ujití krátké procházky", coins: 2}, { label: "ujití sstřední procházky", coins: 3}, { label: "ujití tůry", coins: 6},
        ],
        messageBefore: "Vyberte prosím, na jak dlouhou procházku jste šli.",
        messageAfter: "Procházka je skvělý způsob jak si pročistit hlavu a získat energii! Získali jste odměnu za svou aktivitu."
    },
    gym : {
        options: [
            { label: "navštívení posilovny", coins: 5},
        ],
        messageBefore: "Byli jste v posilovně?",
        messageAfter: "Posilovna je skvělý detox mysli a zlepšuje vaši kondici! Získali jste odměnu za svou aktivitu."
    },
    homeWorkout : {
        options: [
            { label: "20 minut posilování doma", coins: 2}, { label: "40 minut posilování doma", coins: 4}, { label: "60 minut posilování doma", coins: 7},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste posilovali doma.",
        messageAfter: "Posilování doma se počítá stejně jako cvičení v posilovně! Získali jste odměnu za svou aktivitu."
    },
    swimming : {
        options: [
            { label: "30 minut plavání", coins: 3}, { label: "60 minut plavání", coins: 6},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste plavali.",
        messageAfter: "Plavání je skvělý způsob jak se uvolnit a zlepšit svou kondici! Získali jste odměnu za svou aktivitu."
    },
    hiit : {
        options: [
            { label: "15 minut HIIT tréninku", coins: 3}, { label: "30 minut HIIT tréninku", coins: 6},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste cvičili v rámci HIIT tréninku.",
        messageAfter: "HIIT trénink je skvělý způsob jak se pořádně zpotit a zlepšit svou kondici! Získali jste odměnu za svou aktivitu."
    },
    pilates : {
        options: [
            { label: "20 minut pilates", coins: 2}, { label: "45 minut pilates", coins: 4},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste cvičili pilates.",
        messageAfter: "Pilates je skvělý způsob jak zlepšit svou flexibilitu a posílit své tělo! Získali jste odměnu za svou aktivitu."
    },
    climbing : {
        options: [
            { label: "lezení (stěna/skála)", coins: 5},
        ],
        messageBefore: "Lezli jste na stěně nebo na skále?",
        messageAfter: "Lezení je skvělý způsob jak zlepšit svou sílu a koordinaci! Získali jste odměnu za svou aktivitu."
    },
    dance : {
        options: [
            { label: "20 minut tance", coins: 2}, { label: "45 minut tance", coins: 5},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste tančili.",
        messageAfter: "Tanec krásně kombunuje propojení těla a duše! Získali jste odměnu za svou aktivitu."
    },
    skating : {
        options: [
            { label: "30 minut bruslení", coins: 3}, { label: "60 minut bruslení", coins: 6},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste bruslili - ať už na ledě nebo na kolečkových bruslích.",
        messageAfter: "Bruslení je umění, které zlepšuje vaši rovnováhu a kondici! Získali jste odměnu za svou aktivitu."
    },
    cycling : {
        options: [
            { label: "ježdění na kole", coins: 3},
        ],
        messageBefore: "Jeli jste na kole?",
        messageAfter: "Cyklistika je skvělý způsob jak se dostat ven a zlepšit svou kondici! Získali jste odměnu za svou aktivitu."
    },
    reading : {
        options: [
            { label: "20 minut čtení", coins: 1}, { label: "40 minut čtení", coins: 3}, { label: "60 minut čtení", coins: 5},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste četli.",
        messageAfter: "Čtení rozvíjí vaše myšlení a představivost! Získali jste odměnu za rozumné strávení Vašeho času."
    },
    drawing : {
        options: [
            { label: "30 minut kreslení/malování", coins: 2}, { label: "60 minut kreslení/malování", coins: 4},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste kreslili nebo malovali.",
        messageAfter: "Malování a kreslení krásně podtrhne kreativitu! Získali jste odměnu za rozumné strávení Vašeho času."
    },
    meditation : {
        options: [
            { label: "10 minut meditace", coins: 1}, { label: "20 minut meditace", coins: 3},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste meditovali.",
        messageAfter: "Meditace je skvělý způsob jak se uvolnit a zlepšit své duševní zdraví! Získali jste odměnu za svou aktivitu."
    },
    personalProject : {
        options: [
            { label: "30 minut osobního projektu", coins: 2}, { label: "60 minut osobního projektu", coins: 5},
        ],
        messageBefore: "Vyberte prosím, jak dlouho jste pracovali na jakémkoliv Vašem osobním projektu, který se netýkal Vaší práce nebo školy.",
        messageAfter: "Práce na osobním projektu je skvělý způsob jak se rozvíjet a dosáhnout cíle! Získali jste odměnu za svou odhodlanost."
    },
    noSocialMedia : {
        options: [
            { label: "den bez sociálních sítí", coins: 6},
        ],
        messageBefore: "Dokázali jste strávit celý den bez sociálních sítí?",
        messageAfter: "To rozhodně nedokáže každý! Získali jste odměnu za svou sebekázeň"
    },
    sleep : {
        options: [
            { label: "9+ hodin spánku", coins: 2},
        ],
        messageBefore: "Spali jste alespoň 9 hodin?",
        messageAfter: "Dostatečný spánek je důležitý pro vaše duševní i fyzické zdraví! Získali jste odměnu za čas, kdy se mohlo Vaše tělo i mysl zregenerovat."
    }
}

const headers = document.querySelectorAll(".sector-header");

headers.forEach(header => {
  header.addEventListener("click", () => {
    const sector = header.parentElement;
    const quests = sector.querySelector(".quests");
    quests.hidden = !quests.hidden;
  });
});

const questElements = document.querySelectorAll(".quest");
questElements.forEach(quest => {
  quest.addEventListener("click", () => {
    const id = quest.dataset.id;
    openQuestModal(id);
  });
});

let selectedQuest = null;
let selectedOption = null;

function openQuestModal(id) {
  const modal = document.getElementById("questModal");
  const quest = questsValues[id];

  selectedQuest = id;

  document.getElementById("modalMessage").textContent = quest.messageBefore;

  const box = document.getElementById("optionsBox");
  box.innerHTML = "";

  document.getElementById("confirmBox").hidden = true;

  quest.options.forEach((option, index) => {
    const btn = document.createElement("button");
    let coinsString;
    if (option.coins === 1){
        coinsString = "1 coin";
    }
    else if (option.coins < 5){
        coinsString = option.coins + " coiny"
    }
    else {
        coinsString = option.coins + " coinů"
    }
    btn.textContent = `${option.label} (+${coinsString})`;
    let textHistory = "- Za "+ option.label + " jste dostali "+coinsString+".";
    btn.onclick = () => selectOption(id, option.coins, textHistory);
    box.appendChild(btn);
  });
  modal.hidden = false;
}

async function selectOption(id, coins, textHistory) {
  const quest = questsValues[id];
    let result = confirm(quest.messageAfter);
    if (result) {
        closeModal()
        const user_id = await getId();
        await window.electronAPI.user({ user_id: user_id, coins : coins});
        let time = await window.electronAPI.getCurrentDateTime();
        await window.electronAPI.saveToHistory(time+textHistory);
    }
}


function closeModal() {
  document.getElementById("questModal").hidden = true;
}






