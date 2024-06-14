const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
initializeApp();
const db = getFirestore();

const updateUser = async (user, mode) => {
  console.log("updateUser");
  const userRef = db.collection("user").doc(user.userId);
  user.timestamp = Timestamp.now();
  user.mode = mode;

  try {
    await userRef.set(user, { merge: true });
  } catch (error) {
    console.error(error);
  }
};

const getUser = async (userId) => {
  console.log("getUser");
  const userRef = db.collection("user").doc(userId);

  try {
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log("No such document!");
      return undefined;
    } else {
      return doc.data();
    }
  } catch (error) {
    console.error(error);
  }
};



module.exports = { updateUser, getUser }