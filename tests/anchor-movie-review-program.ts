import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert, expect } from "chai";
import { AnchorMovieReviewProgram } from "../target/types/anchor_movie_review_program";

describe("anchor-movie-review-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorMovieReviewProgram as Program<AnchorMovieReviewProgram>;

  const movie = {
    title: "Valroant",
    description: "Perfect!!!!",
    rating: 9,
  };

  const [moviePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  //1.添加电影评论测试
  it("Movie review is added`", async () => {
    const tx = await program.methods
      .addMovieReview(movie.title, movie.description, movie.rating)
      .rpc();

    const account = await program.account.movieAccountState.fetch(moviePda);
    expect(movie.title === account.title);
    expect(movie.rating === account.rating);
    expect(movie.description === account.description);
    expect(account.reviewer === provider.wallet.publicKey);
  });
  //2.更新电影评论测试
  it("Movie review is updated`", async () => {
    const newDescription = "Wow this is new";
    const newRating = 4;

    const tx = await program.methods
      .updateMovieReview(movie.title, newDescription, newRating)
      .rpc();

    const account = await program.account.movieAccountState.fetch(moviePda);
    expect(movie.title === account.title);
    expect(newRating === account.rating);
    expect(newDescription === account.description);
    expect(account.reviewer === provider.wallet.publicKey);
  });
  //3.删除电影评论测试
  it("Deletes a movie review", async () => {
    const tx = await program.methods.deleteMovieReview(movie.title).rpc();
  });
});
