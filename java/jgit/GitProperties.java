package com.wiki.wiki_memory.jgit.config;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.internal.storage.dfs.DfsRepositoryDescription;
import org.eclipse.jgit.internal.storage.dfs.InMemoryRepository;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.ObjectLoader;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevTree;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.eclipse.jgit.transport.RefSpec;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.eclipse.jgit.treewalk.filter.PathFilter;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class GitProperties {

  private String uriRepository(String project) {
    return new StringBuilder(getBaseDirectory(project))
        .append(File.separator).append(".git").toString();
  }

  public String getBaseDirectory(String projectName) {
    return new StringBuilder(System.getProperty("user.home"))
        .append(File.separator).append("projects")
        .append(File.separator).append(projectName)
        .toString();
  }

  public File getBaseGitDir(String projectName) {
    return new File(uriRepository(projectName));
  }

  public List<File> createFolder(String projectName, List<String> folderNames) throws IOException {
    List<File> gitkeep = new ArrayList<>();
    for (String name : folderNames) {
      String folderLocation = new StringBuilder(getBaseDirectory(projectName))
          .append(File.separator)
          .append(name)
          .toString();
      File folder = new File(folderLocation);
      boolean dir = folder.mkdirs();
      if (dir) {
        File gitKeep = new File(
            new StringBuilder(folderLocation)
                .append(File.separator)
                .append(".gitkeep").toString());
        gitKeep.createNewFile();
        gitkeep.add(gitKeep);
      }
    }
    return gitkeep;
  }

  public String uriAbsoluteRepository(String project) {
    return new StringBuilder(System.getProperty("user.home"))
        .append(File.separator).append(project).toString();
  }

  public Repository getRepository(String projectName) throws IOException {
    return new FileRepositoryBuilder()
        .setGitDir(getBaseGitDir(projectName))
        .readEnvironment()
        .setup()
        .findGitDir()
        .build();
  }

  public Repository getMemoryRepository(String projectName) throws IOException {
    return new FileRepositoryBuilder()
        .setGitDir(getBaseGitDir(projectName))
        .readEnvironment()
        .setup()
        .findGitDir()
        .build();
  }

  public ObjectLoader loadRemote(String uri, String branch, String filename) throws Exception {
    DfsRepositoryDescription repoDesc = new DfsRepositoryDescription();
    InMemoryRepository repo = new InMemoryRepository(repoDesc);
    Git git = new Git(repo);
    git.fetch()
        .setRemote(uri)
        .setRefSpecs(new RefSpec("+refs/heads/*:refs/heads/*"))
        .call();
    repo.getObjectDatabase();
    ObjectId lastCommitId = repo.resolve("refs/heads/" + branch);
    RevWalk revWalk = new RevWalk(repo);
    RevCommit commit = revWalk.parseCommit(lastCommitId);
    RevTree tree = commit.getTree();
    TreeWalk treeWalk = new TreeWalk(repo);
    treeWalk.addTree(tree);
    treeWalk.setRecursive(true);
    treeWalk.setFilter(PathFilter.create(filename));
    if (!treeWalk.next()) {
      System.out.println("objectId");

      return null;
    }
    ObjectId objectId = treeWalk.getObjectId(0);
    System.out.println("objectId");
    ObjectLoader loader = repo.open(objectId);
    return loader;
  }

}
