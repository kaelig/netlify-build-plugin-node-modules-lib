import { promises as fs } from 'fs'
import path from 'path'

export const onBuild = async ({ constants, utils }) => {
  const libDir = path.join(constants.PUBLISH_DIR, 'lib')

  try {
    // Ensure lib directory exists
    await fs.mkdir(libDir, { recursive: true })

    // Install production dependencies into lib/
    try {
      await fs.copyFile(path.join('.', 'package.json'), path.join(libDir, 'package.json'));
      await utils.run.command(`npm install --omit=dev --prefix ${libDir} ${libDir}`);
    } catch(error) {
      utils.build.failBuild('Error in copying dependencies', error)
    }

    // Move lib/node_modules/* to lib/*
    const nodeModulesPath = path.join(libDir, 'node_modules')
    const files = await fs.readdir(nodeModulesPath)
    for (const file of files) {
      const oldPath = path.join(nodeModulesPath, file)
      const newPath = path.join(libDir, file)
      await fs.rename(oldPath, newPath)
    }
    await fs.rmdir(nodeModulesPath)

    // Create _redirects file or append to it
    const redirectsPath = path.join(constants.PUBLISH_DIR, '_redirects')
    const redirectsContent = `/node_modules/* /lib/:splat 301!\n`
    await fs.appendFile(redirectsPath, redirectsContent, 'utf8')

    console.log('Dependencies copied and redirects set up.')
  } catch (error) {
    utils.build.failBuild('Error in copying dependencies: ', error)
  }
}
