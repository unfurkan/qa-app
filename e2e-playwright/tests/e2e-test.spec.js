const { test, expect } = require("@playwright/test");

test("Homepage lists courses and clicking course name redirects course detail page", async ({ page }) => {
  const rustCourse = {
    id: 1,
    title: "Rust"
  }
  await goToCourseDetailPage(page, rustCourse)
});

test("Create a new question", async ({ page }) => {

  const rustCourse = {
    id: 1,
    title: "Rust"
  }

  let random = createRandomString(10);
  const question = "Rust " + random;

  await createNewQuestion(page, rustCourse, question)

});

test("User can post only one question in a minute interval", async ({ page }) => {

  const rustCourse = {
    id: 1,
    title: "Rust"
  }

  let random = createRandomString(10);

  const question = "Again rust" + random;

  await createNewQuestion(page, rustCourse, question);

  await page.waitForTimeout(1000); // Wait for 1 second

  const anotherQuestion = "Third rust" + random;

  await page.getByPlaceholder("Post a new question...").fill(anotherQuestion);

  await page.getByRole("button", { name: "Post" }).click();

  const expectedErrorMessage = "Not allowed to create question frequently. Please try again shortly.";

  page.on('dialog', async (dialog) => {
    await expect(dialog.message()).toEqual(expectedErrorMessage)
  });

});

test("Clicking question name navigates user to question details page", async ({ page }) => {
  const rustCourse = {
    id: 1,
    title: "Rust"
  }

  let random = createRandomString(10);

  const question = "What is " + random;

  let createdQuestion = await createNewQuestion(page, rustCourse, question);

  await page.waitForTimeout(1000); // Wait for 1 second

  await page.getByTestId(`question-${createdQuestion.id}`).click();

  await page.waitForURL(`courses/${rustCourse.id}/questions/${createdQuestion.id}`);

});

test("User can answer a question at most once.", async ({ page }) => {

  const rustCourse = {
    id: 1,
    title: "Rust"
  }

  let random = createRandomString(10);

  const question = "What is " + random;

  let createdQuestion = await createNewQuestion(page, rustCourse, question);

  await page.waitForTimeout(1000); // Wait for 1 second

  await page.getByTestId(`question-${createdQuestion.id}`).click();

  await page.waitForURL(`courses/${rustCourse.id}/questions/${createdQuestion.id}`);

  const answer = "Answer " + random;

  await page.getByPlaceholder("Share your opinion...").fill(answer);

  await page.getByRole("button", { name: "Answer" }).click();

  await page.waitForTimeout(1000); // Wait for 1 second

  await page.getByPlaceholder("Share your opinion...").fill(answer);

  await page.getByRole("button", { name: "Answer" }).click();

  const expectedErrorMessage = "User already answered this question.";

  page.on('dialog', async (dialog) => {
    await expect(dialog.message()).toEqual(expectedErrorMessage)
  });

});


const goToCourseDetailPage = async (page, course) => {

  await page.goto("/");

  await page.locator(".ready-for-testing").waitFor();

  await expect(page.getByRole('listitem')).toHaveCount(4);

  await page.getByTestId(course.title).click();

  await page.waitForURL(`courses/${course.id}`);

};


const createNewQuestion = async (page, course, question) => {

  await goToCourseDetailPage(page, course);

  await page.locator(".ready-for-testing").waitFor();

  // Get the count of the question before posting it
  const initialCount = await page.locator("a").filter({ hasText: question }).count();

  await page.getByPlaceholder("Post a new question...").fill(question);

  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/api/questions') && response.status() === 200 && response.request().method() === 'POST'
  );

  await page.getByRole("button", { name: "Post" }).click();
  await expect(page.locator("a").filter({ hasText: question })).toHaveCount(initialCount + 1);

  const response = await responsePromise;

  return await response.json();

};


function createRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


