export default function HelloWorld(){
      const propsUserCard = {
        nama: "Bibi",
        nim: "2457301146",
        tanggal: "2026-03-10"
    }

    return (
        <div>
            <h1>Hello World</h1>
            <p>Selamat Belajar ReactJs</p>
            <GreetingBinjai/>
            <UserCard
            nama="Triza"
            nim="2457301147"
            tanggal="2026/03/10"/>

            <UserCard {...propsUserCard}/>

            <img src="img/ice cream.jpg" width="50%"/>

        </div>
    )
}

function GreetingBinjai(){
    return (
        <small>Salam dari Binjai 👍 </small>
    )
}
function UserCard(props){
    return (
        <div>
            <hr/>
            <h3>Nama: {props.nama}</h3>
            <p>NIM: {props.nim}</p>
            <p>Tanggal: {props.tanggal}</p>
        </div>
    )
}

