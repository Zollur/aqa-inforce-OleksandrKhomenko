import { test, expect } from "@playwright/test";

test.describe.serial("Room Management and Booking API Tests", () => {
  let adminToken: string;
  let roomId: number;
  const roomName = `Room${Date.now()}`;
  const baseApiUrl = "https://automationintesting.online/api";

  test.beforeAll(async ({ request }) => {
    await test.step("Get Admin Auth Token", async () => {
      const loginRes = await request.post(`${baseApiUrl}/auth/login`, {
        data: {
          username: "admin",
          password: "password",
        },
      });
      expect(loginRes.status()).toBe(200);
      const loginData = await loginRes.json();
      adminToken = loginData.token;
      expect(adminToken).toBeTruthy();
    });
  });

  test("Create a Room using the Admin page(API) and check that the room was created on the User page(API)", async ({ request }) => {
    await test.step("Create Room (Admin API)", async () => {
      const createRes = await request.post(`${baseApiUrl}/room`, {
        headers: {
          Cookie: `token=${adminToken}`,
        },
        data: {
          roomName: roomName,
          type: "Single",
          accessible: true,
          image: "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg",
          description: "A cozy room created via API tests.",
          features: ["WiFi", "TV"],
          roomPrice: 150,
        },
      });
      expect(createRes.status()).toBe(200);
    });

    await test.step("Check Room on User Page API", async () => {
      const getRes = await request.get(`${baseApiUrl}/room`);
      expect(getRes.status()).toBe(200);
      const getData = await getRes.json();
      
      const createdRoom = getData.rooms.find((r: any) => r.roomName === roomName);
      expect(createdRoom).toBeDefined();
      expect(createdRoom.roomPrice).toBe(150);
      
      roomId = createdRoom.roomid;
      expect(roomId).toBeGreaterThan(0);
    });
  });

  test("Book the room using the User page(API), and then check that the room is booked on the Admin page(API)", async ({ request }) => {
    const checkin = "2027-06-10";
    const checkout = "2027-06-15";

    await test.step("Book Room (User API)", async () => {
      const bookRes = await request.post(`${baseApiUrl}/booking`, {
        data: {
          bookingdates: { checkin, checkout },
          depositpaid: false,
          firstname: "API",
          lastname: "Tester",
          roomid: roomId,
          email: "api.tester@example.com",
          phone: "123456789012",
        },
      });
      expect(bookRes.status()).toBe(201);
      const bookData = await bookRes.json();
      expect(bookData.bookingid).toBeGreaterThan(0);
    });

    await test.step("Check Booking on Admin Page API", async () => {
      const reportRes = await request.get(`${baseApiUrl}/report/room/${roomId}`, {
        headers: {
          Cookie: `token=${adminToken}`,
        },
      });
      expect(reportRes.status()).toBe(200);
      const reportData = await reportRes.json();
      expect(reportData.report.length).toBeGreaterThan(0);
      
      const bookingReport = reportData.report.find((r: any) => r.start === checkin && r.end === checkout && r.title === "Unavailable");
      expect(bookingReport).toBeDefined();
    });
  });

  test("Edit Room in the Admin page (Rooms) menu using API and check changes in the User page(API)", async ({ request }) => {
    await test.step("Edit Room (Admin API)", async () => {
      const editRes = await request.put(`${baseApiUrl}/room/${roomId}`, {
        headers: {
          Cookie: `token=${adminToken}`,
        },
        data: {
          roomid: roomId,
          roomName: roomName,
          type: "Double",
          accessible: true,
          image: "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg",
          description: "A cozy room updated via API tests.",
          features: ["WiFi", "TV", "Radio"],
          roomPrice: 200,
        },
      });
      expect(editRes.status()).toBe(202);
    });

    await test.step("Check Changes on User Page API", async () => {
      const getRes = await request.get(`${baseApiUrl}/room`);
      expect(getRes.status()).toBe(200);
      const getData = await getRes.json();
      
      const updatedRoom = getData.rooms.find((r: any) => r.roomName === roomName);
      expect(updatedRoom).toBeDefined();
      expect(updatedRoom.roomPrice).toBe(200);
      expect(updatedRoom.type).toBe("Double");
      expect(updatedRoom.features).toContain("Radio");
    });
  });

  test("Delete the Room using the Admin page(API) and check that the room was deleted in the User page(API)", async ({ request }) => {
    await test.step("Delete Room (Admin API)", async () => {
      const deleteRes = await request.delete(`${baseApiUrl}/room/${roomId}`, {
        headers: {
          Cookie: `token=${adminToken}`,
        },
      });
      expect(deleteRes.status()).toBe(202);
    });

    await test.step("Check Deletion on User Page API", async () => {
      const getRes = await request.get(`${baseApiUrl}/room`);
      expect(getRes.status()).toBe(200);
      const getData = await getRes.json();
      
      const deletedRoom = getData.rooms.find((r: any) => r.roomName === roomName);
      expect(deletedRoom).toBeUndefined();
    });
  });
});