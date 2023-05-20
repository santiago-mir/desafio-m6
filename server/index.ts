import * as express from "express";
import { firestore, rtdb } from "./db";
import * as cors from "cors";
import * as path from "path";
import { nanoid } from "nanoid";

const app = express();
app.use(cors());
app.use(express.json());
const port = 3002;

const userRef = firestore.collection("users");
const roomRef = firestore.collection("rooms");

app.post("/signup", (req, res) => {
  const email: string = req.body.email;
  const nombre: string = req.body.nombre;
  userRef
    .where("email", "==", email)
    .get()
    .then((snap) => {
      if (snap.empty) {
        userRef
          .add({
            email,
            nombre,
          })
          .then((newRef) => {
            res.json({
              id: newRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json("user already exists");
      }
    });
});

app.post("/auth", (req, res) => {
  const { email } = req.body;
  userRef
    .where("email", "==", email)
    .get()
    .then((snap) => {
      if (snap.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          id: snap.docs[0].id,
          data: snap.docs[0].data(),
        });
      }
    });
});
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  const { userName } = req.body;
  userRef
    .doc(userId.toString())
    .get()
    .then((snap) => {
      if (snap.exists) {
        const newRoomRef = rtdb.ref("rooms/" + nanoid());
        newRoomRef
          .set({
            owner: userId,
            currentGame: {
              playerOne: {
                name: userName,
                online: true,
                start: false,
              },
              playerTwo: {
                name: "",
                online: false,
                start: false,
              },
              history: [],
            },
          })
          .then(() => {
            const roomPrivateId = newRoomRef.key;
            const roomPublicId = 1000 + Math.floor(Math.random() * 999);
            roomRef
              .doc(roomPublicId.toString())
              .set({
                rtdbRoomId: roomPrivateId,
              })
              .then(() => {
                res.json({
                  id: roomPublicId.toString(),
                  privateId: roomPrivateId!.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  const { userName } = req.query;
  userRef
    .doc(userId!.toString())
    .get()
    .then((snap) => {
      if (snap.exists) {
        roomRef
          .doc(roomId)
          .get()
          .then((docSnap) => {
            const data = docSnap.data();
            let rtdbRoomRef = rtdb.ref("rooms/" + data.rtdbRoomId);
            rtdbRoomRef.child("currentGame").child("playerTwo").update({
              name: userName,
              online: true,
            });
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});
app.patch("/rooms/status", (req, res) => {
  const { userId } = req.body;
  const { roomId } = req.body;
  const { player } = req.body;
  userRef
    .doc(userId.toString())
    .get()
    .then((snap) => {
      if (snap.exists) {
        let data = { player: player, status: true };
        let rtdbRoomRef = rtdb.ref("rooms/" + roomId);
        rtdbRoomRef.child("currentGame").child(player).update({
          start: true,
        });
        res.json(data);
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});
app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => console.log("escuchando puerto" + port));
