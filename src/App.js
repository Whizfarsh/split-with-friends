import { useState } from "react";
import "./style.css";

const initialFriends = [
	{
		id: 118836,
		name: "Elina",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Rose",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Michael",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function HandleAddFriendToggle() {
		setShowAddFriend(!showAddFriend);
		setSelectedFriend(null);
	}

	function handleAddFriends(friend) {
		setFriends((friends) => [...friends, friend]);
		// setSelectedFriend(null);
	}

	function handleSelectedFriend(friend) {
		setSelectedFriend((name) => (name?.id === friend.id ? null : friend));
		setShowAddFriend(false);
		// friends.ma
		// console.log(selectedFriend);
	}
	function handleBillSplit(amount) {
		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + amount }
					: friend
			)
		);

		setSelectedFriend(null);
	}
	return (
		<div className="App">
			<div className="bill-spliting">
				<Friends
					setFriends={setFriends}
					showAddFriend={showAddFriend}
					setShowAddFriend={setShowAddFriend}
					HandleAddFriendToggle={HandleAddFriendToggle}
					handleAddFriends={handleAddFriends}
				>
					{friends.map((friend) => (
						<Friend
							friend={friend}
							selectedFriend={selectedFriend}
							handleAddFriends
							handleSelectedFriend={handleSelectedFriend}
							key={friend.id}
						/>
					))}
					{showAddFriend && <FriendAdd onAdd={handleAddFriends} />}
					<button
						className="btn btn-add"
						onClick={() => HandleAddFriendToggle()}
					>
						{!showAddFriend ? "Add Friend" : "Close"}
					</button>
				</Friends>
				{selectedFriend && (
					<BillSplit
						selectedFriend={selectedFriend}
						handleBill={handleBillSplit}
					/>
				)}
			</div>
		</div>
	);
}

function Friends({ children }) {
	return (
		<div className="Friends-col">
			<div className="Friends-list">{children}</div>
		</div>
	);
}
function Friend({ friend, selectedFriend, handleSelectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;
	return (
		<div className={isSelected ? "friend-list active-friend" : "friend-list "}>
			<img className="friend-img" src={friend.image} alt="" />
			<p className="uwithfriend">
				<span className="name">{friend.name}</span>{" "}
				<span
					style={
						friend.balance > 0
							? { color: "green" }
							: friend.balance < 0
							? { color: "red" }
							: {}
					}
				>
					{friend.balance === 0
						? ` You and ${friend.name} are even`
						: friend.balance < 0
						? `You owe ${friend.name} ${Math.abs(friend.balance)}`
						: `${friend.name} owes you ${friend.balance}`}
				</span>
			</p>
			<button className="btn" onClick={() => handleSelectedFriend(friend)}>
				{isSelected ? "close" : "select"}
			</button>
		</div>
	);
}

function FriendAdd({ onAdd }) {
	const [friendName, setFriendName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");

	// if (!friendName) return;
	function handleAddFriend(e) {
		e.preventDefault();
		if (!friendName) return;

		const id = crypto.randomUUID();
		const newFriend = {
			id: id,
			name: friendName,
			image: `${image}?=${id}`,
			balance: 0,
		};
		console.log(newFriend);

		onAdd(newFriend);

		setFriendName("");
		setImage("https://i.pravatar.cc/48");
	}
	return (
		<div>
			<form className="friends-add" onSubmit={handleAddFriend}>
				<label>Friend's name 🤼</label>
				<input
					type="text"
					name=""
					id=""
					value={friendName}
					onChange={(e) => setFriendName(e.target.value)}
				/>
				<label>Image URL 🖼</label>
				<input
					type="text"
					name=""
					id=""
					value={image}
					onChange={(e) => setImage(e.target.value)}
				/>
				<button className="btn">Add</button>
			</form>
		</div>
	);
}

function BillSplit({ selectedFriend, handleBill }) {
	const [billValue, setBillValue] = useState("");
	const [expense, setExpense] = useState("");
	const [whoIsPaying, setWhoIsPaying] = useState("user");

	const friendExpense = billValue ? billValue - expense : "";

	function handleSubmit(e) {
		e.preventDefault();

		if (!billValue || !expense) return;
		handleBill(whoIsPaying === "user" ? friendExpense : -friendExpense);
	}

	return (
		<div className="bill-split">
			<h3>You are spliting a bill with {selectedFriend.name}</h3>
			<form className="form" onSubmit={handleSubmit}>
				<label>💰 Bill value</label>
				<input
					type="text"
					value={billValue}
					onChange={(e) => setBillValue(e.target.value)}
				/>
				<label>🕴 Your expense</label>
				<input
					type="text"
					value={expense}
					onChange={(e) => setExpense(e.target.value)}
				/>
				<label>👫 {selectedFriend.name} expense</label>
				<input type="text" value={friendExpense} disabled />
				<label>🤑 Who is paying the bill?</label>
				<select
					value={whoIsPaying}
					onChange={(e) => setWhoIsPaying(e.target.value)}
				>
					<option value="user">You</option>
					<option value={selectedFriend.name}>{selectedFriend.name}</option>
				</select>
				<button>Split bill</button>
			</form>
		</div>
	);
}
